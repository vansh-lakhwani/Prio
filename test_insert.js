require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function test() {
  const { data, error } = await supabase.from('subtasks').upsert([
    {
      task_id: '7fafb99d-04de-4604-a0cb-825415583846',
      title: 'Test Subtask',
      done: false,
      due_date: '2026-04-07',
      priority: 'high',
      updated_at: new Date().toISOString()
    }
  ]);
  console.log('Result:', data);
  console.log('Error:', error);
}

test();
