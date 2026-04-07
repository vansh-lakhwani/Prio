# Supabase Authentication Setup Guide

This guide will walk you through configuring Google OAuth in your Supabase project for the **Prio** task manager.

## Prerequisites
1.  A Supabase project (already created).
2.  A Google Cloud Console account (to generate OAuth credentials).

---

## Step 1: Create Google Cloud OAuth Credentials
1.  Go to the [Google Cloud Console](https://console.cloud.google.com/).
2.  Create a new project (e.g., "Prio Task Manager Auth").
3.  Navigate to **APIs & Services** > **OAuth consent screen** and configure it for **External** use.
    *   **App name:** Prio
    *   **User support email:** `<your email>`
    *   **Developer contact information:** `<your email>`
4.  Navigate to **APIs & Services** > **Credentials**.
5.  Click **Create Credentials** > **OAuth client ID**.
6.  Select **Web application** as the application type.
7.  Under **Authorized redirect URIs**, add your Supabase project's OAuth URL. You can find this in your Supabase Dashboard:
    *   **Supabase Dashboard** -> **Authentication** -> **Providers** -> **Google**.
    *   Copy the **Callback URL (for OAuth)** (it will look like `https://<project-ref>.supabase.co/auth/v1/callback`).
    *   Paste this URL into the Google Cloud Console.
8.  Click **Create**. You will receive a **Client ID** and a **Client secret**. Keep these handy.

## Step 2: Enable Google OAuth in Supabase
1.  Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2.  Select your project.
3.  Navigate to **Authentication** > **Providers**.
4.  Click on **Google** and toggle **Enable Sign in with Google**.
5.  Paste the **Client ID** and **Client Secret** you obtained from the Google Cloud Console.
6.  Click **Save**.

## Step 3: Configure Redirect URLs in Supabase
Supabase needs to know where it is allowed to redirect users after they successfully log in.

1.  In your Supabase Dashboard, navigate to **Authentication** > **URL Configuration**.
2.  Under **Site URL**, enter your application's base URL (e.g., `http://localhost:3000` for local development or `<your-production-url>` for deployment).
3.  Under **Redirect URLs**, add any specific callback routes you intend to use. For development, adding `http://localhost:3000/**` is usually sufficient to handle all local callbacks.

## Step 4: Apply Database Migrations
If you have not already run the initial database setup script:
1.  In your Supabase Dashboard, go to the **SQL Editor**.
2.  Copy the contents of `supabase/migrations/00001_initial_schema.sql` from this repository.
3.  Paste the SQL code into a new query and click **Run**.
4.  This establishes your secure schema, including tables, Row Level Security (RLS) policies, and automated user profile generation logic.

You are now fully configured for Supabase backend and authentication!
