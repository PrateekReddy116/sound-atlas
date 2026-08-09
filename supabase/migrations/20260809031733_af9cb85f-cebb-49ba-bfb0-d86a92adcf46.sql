CREATE TABLE public.profiles (
  id UUID NOT NULL PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.profiles TO anon;
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can create their own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE TABLE public.world_locations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  spotify_track_id TEXT NOT NULL,
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  artwork_url TEXT,
  position_x DOUBLE PRECISION NOT NULL DEFAULT 0,
  position_y DOUBLE PRECISION NOT NULL DEFAULT 0,
  position_z DOUBLE PRECISION NOT NULL DEFAULT 0,
  rotation_x DOUBLE PRECISION NOT NULL DEFAULT 0,
  rotation_y DOUBLE PRECISION NOT NULL DEFAULT 0,
  rotation_z DOUBLE PRECISION NOT NULL DEFAULT 0,
  scale DOUBLE PRECISION NOT NULL DEFAULT 1,
  is_demo BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.world_locations TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.world_locations TO authenticated;
GRANT ALL ON public.world_locations TO service_role;
ALTER TABLE public.world_locations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "The world is visible to everyone" ON public.world_locations FOR SELECT USING (true);
CREATE POLICY "Signed in users can leave their own songs" ON public.world_locations FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by AND is_demo = false);
CREATE POLICY "Users can move their own songs" ON public.world_locations FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Users can remove their own songs" ON public.world_locations FOR DELETE TO authenticated USING (auth.uid() = created_by);

CREATE INDEX world_locations_created_at_idx ON public.world_locations (created_at DESC);

INSERT INTO public.world_locations (spotify_track_id, title, artist, album, artwork_url, position_x, position_y, position_z, rotation_y, is_demo) VALUES
('7H0ya83CMmgFcOhw0UB6ow','Space Song','Beach House','Depression Cherry','https://i.scdn.co/image/ab67616d00001e02d1430224d631eaa5954f13c9', 6.5, 1.2, -8.0, 0.4, true),
('3AhXZa8sUQht0UEdBJgpGc','Like a Rolling Stone','Bob Dylan','Highway 61 Revisited','https://i.scdn.co/image/ab67616d00001e020cb0884829c5503b2e242541', -22.0, 2.6, -34.0, -0.6, true),
('5ihS6UUlyQAfmp48eSkxuQ','Landslide','Fleetwood Mac','Fleetwood Mac','https://i.scdn.co/image/ab67616d00001e024fb043195e8d07e72edc7226', 41.0, -1.8, -19.0, 1.1, true),
('2takcwOaAZWiXQijPHIx7B','Time Is Running Out','Muse','Absolution','https://i.scdn.co/image/ab67616d00001e0248cf14e1e805e59e001b10ea', -47.0, 3.4, 26.0, 2.2, true),
('1CS7Sd1u5tWkstBhpssyjP','Take Me to Church','Hozier','Hozier','https://i.scdn.co/image/ab67616d00001e027a9bf5f82e32d33d4503fe7b', 18.0, 4.8, 52.0, -1.4, true),
('3JOVTQ5h8HGFnDdp4VT3MP','Mad World','Gary Jules','Trading Snakeoil for Wolftickets','https://i.scdn.co/image/ab67616d00001e027948eec521c67e76cafe30a0', -13.0, -2.2, 44.0, 0.9, true),
('7ouMYWpwJ422jRcDASZB7P','Knights of Cydonia','Muse','Black Holes and Revelations','https://i.scdn.co/image/ab67616d00001e0228933b808bfb4cbbd0385400', 63.0, 5.5, -58.0, -2.0, true),
('4u7EnebtmKWzUH433cf5Qv','Bohemian Rhapsody','Queen','A Night at the Opera','https://i.scdn.co/image/ab67616d00001e02ce4f1737bc8a646c8c4bd25a', -68.0, -3.0, -12.0, 1.7, true),
('60a0Rd6pjrkxjPbaKzXjfq','In the End','Linkin Park','Hybrid Theory','https://i.scdn.co/image/ab67616d00001e026741ca6e9ba6fdc166037321', 29.0, 6.2, 88.0, -0.3, true),
('3Kkjo3cT83cw09VJyrLNwX','Oh My God','Adele','30','https://i.scdn.co/image/ab67616d00001e02c6b577e4c4a6d326354a89f7', -85.0, 2.0, 70.0, 2.6, true);