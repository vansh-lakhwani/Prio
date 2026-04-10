# Prio - Premium Task Management

Prio is a modern, high-performance, real-time task management application built to help users seamlessly organize their workflow. Showcasing a premium "Kinetic" design system, Prio offers a stunning user interface equipped with instantaneous database synchronization via Supabase.

## 🚀 Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (Version 16, App Router)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with custom Kinetic design tokens
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **State Management**: [Zustand](https://zustand-demo.pmnd.rs/) (with optimistic updates)
- **Database & Auth**: [Supabase](https://supabase.com/) (PostgreSQL, Realtime, SSR Auth)
- **Drag & Drop**: [@dnd-kit](https://dndkit.com/)
- **Forms & Data Validation**: [react-hook-form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **PWA Capabilities**: [@serwist/next](https://serwist.build/)
- **Rich Text Editing**: [Tiptap](https://tiptap.dev/)
- **Charts**: [Recharts](https://recharts.org/)

## ✨ Key Functionalities

- **Real-Time Synchronization**: Instant sub-second task updates across multiple devices using Supabase Realtime channels (`db_sync`).
- **Interactive Kanban Board**: Beautiful drag-and-drop interface prioritizing tasks via customizable columns.
- **Smart Calendar View**: Track deadlines and schedule your upcoming agenda visually.
- **Comprehensive Task Details**: Use the Tiptap-powered rich text editor to append notes. Break down complex tasks into nested subtasks. 
- **Insights & Productivity Analytics**: Real-time charts to visualize task completion velocities and overall productivity streams.
- **Progressive Web App (PWA)**: Installable as a native-like application on desktop and mobile platforms with robust service worker caching.
- **Keyboard Shortcuts & Power-User Tools**: Rapidly navigate and create tasks without lifting your hands from the keyboard.
- **Optimistic UI Updates**: Leveraging Zustand for blazing-fast local mutations that gracefully sync with the backend.

## 📁 Project Structure

```text
├── app/               # Next.js App Router (Auth, Dashboard, API routes)
├── components/        # React components (Kanban, Calendar, Insights, Profile, Modals, UI primitives)
├── lib/               # Utility functions, Supabase clients, PWA configurations, custom hooks
├── stores/            # Zustand global state managers with optimistic updates (dashboardStore, authStore)
├── supabase/          # Supabase configuration, schema definitions, and SQL migrations
├── types/             # TypeScript interfaces for tasks, stats, and database typings
└── public/            # Static assets and PWA icons
```

## 🛠 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v20+) and `npm` installed. You will also need a registered Supabase project.

### 1. Installation

Clone the repository and install the dependencies:

```bash
npm install
```

### 2. Environment Variables

Create a `.env.local` file at the root of the project and populate it with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 3. Database Setup

Apply the provided migrations within the `supabase/migrations/` directory to construct your PostgreSQL schema (tasks, subtasks, user_stats, task_activity).

### 4. Running Locally

Start the development server:

```bash
npm run dev
```

Navigate to `http://localhost:3000` to view the application. The landing page will automatically steer unauthenticated traffic to the login portal.

## 🚢 Deployment

This application is ready to be deployed optimally via [Vercel](https://vercel.com/new). Ensure you import your `.env` variables into the Vercel dashboard prior to building.
