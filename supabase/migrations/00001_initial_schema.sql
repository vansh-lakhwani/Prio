-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles Table
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  theme_preference TEXT DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Categories Table
CREATE TABLE public.categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#10B981',
  icon TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tasks Table
CREATE TABLE public.tasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in_progress', 'review', 'done')),
  priority TEXT DEFAULT 'none' CHECK (priority IN ('low', 'medium', 'high', 'none')),
  due_date TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  position INTEGER DEFAULT 0,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Labels Table
CREATE TABLE public.labels (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Task Labels (Junction)
CREATE TABLE public.task_labels (
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE,
  label_id UUID REFERENCES public.labels(id) ON DELETE CASCADE,
  PRIMARY KEY (task_id, label_id)
);

-- 6. Subtasks Table
CREATE TABLE public.subtasks (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  position INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Task Activity
CREATE TABLE public.task_activity (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  task_id UUID REFERENCES public.tasks(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  action TEXT CHECK (action IN ('created', 'updated', 'completed', 'deleted')),
  changes JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. User Stats
CREATE TABLE public.user_stats (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE UNIQUE NOT NULL,
  total_tasks_completed INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_activity_date DATE DEFAULT CURRENT_DATE,
  productivity_score INTEGER DEFAULT 0
);

-- Trigger: Automatically Create Profile and User Stats on Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name',
    NEW.raw_user_meta_data->>'avatar_url'
  );
  
  INSERT INTO public.user_stats (user_id)
  VALUES (NEW.id);
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Trigger: Automatically update 'updated_at' columns
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_modtime BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_tasks_modtime BEFORE UPDATE ON public.tasks FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();
CREATE TRIGGER update_subtasks_modtime BEFORE UPDATE ON public.subtasks FOR EACH ROW EXECUTE PROCEDURE public.update_updated_at_column();


-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_labels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_activity ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_stats ENABLE ROW LEVEL SECURITY;

-- Profiles: Readable by all authenticated users (for collaboration), but only updatable by owner
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (auth.role() = 'authenticated');
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Categories
CREATE POLICY "Users can view own categories." ON public.categories FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own categories." ON public.categories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own categories." ON public.categories FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own categories." ON public.categories FOR DELETE USING (auth.uid() = user_id);

-- Labels
CREATE POLICY "Users can view own labels." ON public.labels FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own labels." ON public.labels FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own labels." ON public.labels FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own labels." ON public.labels FOR DELETE USING (auth.uid() = user_id);

-- Tasks
CREATE POLICY "Users can view own tasks." ON public.tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own tasks." ON public.tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own tasks." ON public.tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own tasks." ON public.tasks FOR DELETE USING (auth.uid() = user_id);

-- Task Labels (Need to check if the user owns the task)
CREATE POLICY "Users can view task labels for own tasks" ON public.task_labels FOR SELECT USING (EXISTS (SELECT 1 FROM public.tasks WHERE id = task_labels.task_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert task labels for own tasks" ON public.task_labels FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.tasks WHERE id = task_labels.task_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete task labels for own tasks" ON public.task_labels FOR DELETE USING (EXISTS (SELECT 1 FROM public.tasks WHERE id = task_labels.task_id AND user_id = auth.uid()));

-- Subtasks
CREATE POLICY "Users can view subtasks for own tasks" ON public.subtasks FOR SELECT USING (EXISTS (SELECT 1 FROM public.tasks WHERE id = subtasks.task_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert subtasks for own tasks" ON public.subtasks FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.tasks WHERE id = subtasks.task_id AND user_id = auth.uid()));
CREATE POLICY "Users can update subtasks for own tasks" ON public.subtasks FOR UPDATE USING (EXISTS (SELECT 1 FROM public.tasks WHERE id = subtasks.task_id AND user_id = auth.uid()));
CREATE POLICY "Users can delete subtasks for own tasks" ON public.subtasks FOR DELETE USING (EXISTS (SELECT 1 FROM public.tasks WHERE id = subtasks.task_id AND user_id = auth.uid()));

-- Task Activity
CREATE POLICY "Users can view activity for own tasks" ON public.task_activity FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can insert activity for own tasks" ON public.task_activity FOR INSERT WITH CHECK (user_id = auth.uid());

-- User Stats
CREATE POLICY "Users can view own stats" ON public.user_stats FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users can update own stats" ON public.user_stats FOR UPDATE USING (user_id = auth.uid());
