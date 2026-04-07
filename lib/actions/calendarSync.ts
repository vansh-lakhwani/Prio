'use server';

import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { GoogleCalendarService } from '@/lib/google/calendar';
import { Task } from '@/types/dashboard';

export async function syncGoogleCalendar() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        },
      },
    }
  );

  // 1. Get current session and calendar settings
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return { error: 'Not authenticated' };

  const { data: syncSettings } = await supabase
    .from('calendar_sync')
    .select('*')
    .eq('user_id', session.user.id)
    .single();

  if (!syncSettings || !syncSettings.sync_enabled) {
    return { error: 'Sync not enabled' };
  }

  // 2. Initialize Google Service
  // Note: ideally we should refresh token if expired, 
  // but provider_token is often short-lived. 
  // For production, we'd use syncSettings.google_refresh_token.
  const calendarService = new GoogleCalendarService(
    session.provider_token!, 
    syncSettings.google_refresh_token
  );

  try {
    // 3. FETCH: Get all tasks that need syncing
    const { data: tasks } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', session.user.id);

    if (!tasks) return { success: true };

    // 4. PUSH to Google
    for (const task of tasks as Task[]) {
      const eventBody = {
        summary: task.title,
        description: task.description || '',
        start: {
          dateTime: task.due_date || new Date().toISOString(),
        },
        end: {
          dateTime: task.due_date 
            ? new Date(new Date(task.due_date).getTime() + 60 * 60 * 1000).toISOString() 
            : new Date(new Date().getTime() + 60 * 60 * 1000).toISOString(),
        },
        status: task.status === 'done' ? 'confirmed' : 'tentative',
      };

      if (task.google_event_id) {
        // Update existing event
        try {
          await calendarService.updateEvent(task.google_event_id, eventBody, syncSettings.google_calendar_id);
        } catch (e) {
          // If event was deleted in Google, create it again
          const newEvent = await calendarService.createEvent(eventBody, syncSettings.google_calendar_id);
          await supabase.from('tasks').update({ google_event_id: newEvent.id }).eq('id', task.id);
        }
      } else {
        // Create new event
        const newEvent = await calendarService.createEvent(eventBody, syncSettings.google_calendar_id);
        await supabase.from('tasks').update({ google_event_id: newEvent.id }).eq('id', task.id);
      }
    }

    // 5. PULL from Google
    const googleEvents = await calendarService.listEvents(syncSettings.google_calendar_id);
    const existingGoogleEventIds = new Set(tasks.map(t => t.google_event_id).filter(Boolean));

    for (const event of googleEvents) {
      if (!event.id || existingGoogleEventIds.has(event.id)) continue;

      // Import new event from Google as task
      await supabase.from('tasks').insert({
        user_id: session.user.id,
        title: event.summary || 'Untitled Event',
        description: event.description || '',
        due_date: event.start?.dateTime || event.start?.date || null,
        status: 'todo',
        priority: 'none',
        google_event_id: event.id
      });
    }

    // 6. Update last sync time
    await supabase
      .from('calendar_sync')
      .update({ last_sync_at: new Date().toISOString() })
      .eq('user_id', session.user.id);

    return { success: true };
  } catch (error: any) {
    console.error('Sync failed:', error);
    return { error: error.message };
  }
}
