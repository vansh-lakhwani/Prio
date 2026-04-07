# How to Sync Prio with Your Phone

Prio is a modern Web Application (PWA) that offers two primary ways to stay in sync with your mobile device: direct app installation and calendar integration.

## 1. Install the Prio App (PWA)
Installing Prio as a Progressive Web App gives you a native-like experience with an icon on your home screen and faster access.

### On iOS (iPhone/iPad):
1. Open **Safari** and navigate to your Prio dashboard.
2. Tap the **Share** button (the square with an upward arrow) at the bottom.
3. Scroll down and tap **"Add to Home Screen."**
4. Tap **"Add"** in the top right corner. The Prio icon will now appear on your home screen.

### On Android:
1. Open **Chrome** and navigate to your Prio dashboard.
2. Tap the **Three Dots** (menu) in the top right corner.
3. Tap **"Install App"** or **"Add to Home Screen."**
4. Follow the prompts to confirm.

---

## 2. Sync Prio with Your Phone's Calendar
By connecting Prio to Google Calendar, any task with a **Due Date** will automatically appear in your phone's native calendar app (Apple Calendar, Google Calendar, etc.).

### Steps to Enable:
1. Go to the **Calendar** page in Prio.
2. In the left sidebar, locate the **Google Calendar** section.
3. Click **"Connect Google Calendar"** and follow the authentication steps.
4. Once connected, ensure **"Sync Enabled"** is active.
5. On your phone, make sure you are signed into the **same Google Account** in your system settings (under Mail/Calendar).
6. Enable the "Prio" or "Primary" calendar in your phone's calendar app settings.

---

## 3. Real-time Sync
Prio uses **Supabase Realtime**, meaning any change you make on your desktop (completing a task, changing a priority, or reordering a Kanban column) will reflect instantly on your phone's screen if the PWA is open.

### Troubleshooting:
- **Tasks not appearing?** Ensure your Prio task has a valid `Due Date`. Google Calendar only displays events with specific time/date allocations.
- **Connection Error?** If you see a "Realtime Connection Error," try refreshing the app. Your data is still saved to the database and will sync once the connection is restored.
