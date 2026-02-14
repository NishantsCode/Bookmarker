
-- STEP 1: CREATE BOOKMARKS TABLE
CREATE TABLE bookmarks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- STEP 2: ENABLE ROW LEVEL SECURITY
ALTER TABLE bookmarks ENABLE ROW LEVEL SECURITY;

-- STEP 3: CREATE ALL RLS POLICIES

-- Policy 1: Users can view their own bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON bookmarks
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy 2: Users can insert their own bookmarks
CREATE POLICY "Users can insert own bookmarks"
  ON bookmarks
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy 3: Users can update their own bookmarks
CREATE POLICY "Users can update own bookmarks"
  ON bookmarks
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy 4: Users can delete their own bookmarks
CREATE POLICY "Users can delete own bookmarks"
  ON bookmarks
  FOR DELETE
  USING (auth.uid() = user_id);

-- STEP 4: SET DEFAULT VALUE FOR user_id
-- Automatically set user_id to current authenticated user
ALTER TABLE bookmarks ALTER COLUMN user_id SET DEFAULT auth.uid();

-- STEP 5: ENABLE REALTIME (CRITICAL!)
ALTER PUBLICATION supabase_realtime ADD TABLE bookmarks;

