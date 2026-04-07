import { google, calendar_v3 } from 'googleapis';
import { getGoogleOAuth2Client } from './auth';

export class GoogleCalendarService {
  private calendar: calendar_v3.Calendar;

  constructor(accessToken: string, refreshToken?: string) {
    const auth = getGoogleOAuth2Client(accessToken, refreshToken);
    this.calendar = google.calendar({ version: 'v3', auth });
  }

  async listEvents(calendarId: string = 'primary', timeMin: string = new Date().toISOString()) {
    try {
      const response = await this.calendar.events.list({
        calendarId,
        timeMin,
        maxResults: 100,
        singleEvents: true,
        orderBy: 'startTime',
      });
      return response.data.items || [];
    } catch (error) {
      console.error('Error listing Google Calendar events:', error);
      throw error;
    }
  }

  async createEvent(event: calendar_v3.Schema$Event, calendarId: string = 'primary') {
    try {
      const response = await this.calendar.events.insert({
        calendarId,
        requestBody: event,
      });
      return response.data;
    } catch (error) {
      console.error('Error creating Google Calendar event:', error);
      throw error;
    }
  }

  async updateEvent(eventId: string, event: calendar_v3.Schema$Event, calendarId: string = 'primary') {
    try {
      const response = await this.calendar.events.update({
        calendarId,
        eventId,
        requestBody: event,
      });
      return response.data;
    } catch (error) {
      console.error('Error updating Google Calendar event:', error);
      throw error;
    }
  }

  async deleteEvent(eventId: string, calendarId: string = 'primary') {
    try {
      await this.calendar.events.delete({
        calendarId,
        eventId,
      });
    } catch (error) {
      console.error('Error deleting Google Calendar event:', error);
      throw error;
    }
  }
}
