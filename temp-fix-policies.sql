-- Drop any existing policies
      DO $$
      DECLARE
          policy_name text;
      BEGIN
          FOR policy_name IN (
              SELECT policyname FROM pg_policies 
              WHERE schemaname = 'storage' AND tablename = 'buckets'
          )
          LOOP
              EXECUTE format('DROP POLICY IF EXISTS %I ON storage.buckets', policy_name);
          END LOOP;
          
          FOR policy_name IN (
              SELECT policyname FROM pg_policies 
              WHERE schemaname = 'storage' AND tablename = 'objects'
          )
          LOOP
              EXECUTE format('DROP POLICY IF EXISTS %I ON storage.objects', policy_name);
          END LOOP;
      END $$;

      -- Make sure RLS is enabled
      ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;
      ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
      
      -- Create simple permissive policies
      CREATE POLICY "Give users access to buckets" ON storage.buckets
      FOR ALL TO authenticated USING (true) WITH CHECK (true);
      
      CREATE POLICY "Public users can see buckets" ON storage.buckets
      FOR SELECT TO anon USING (public = true);
      
      CREATE POLICY "Allow all operations for authenticated users" ON storage.objects
      FOR ALL TO authenticated 
      USING (true) WITH CHECK (true);
      
      CREATE POLICY "Allow public access to public buckets" ON storage.objects
      FOR SELECT TO anon
      USING (bucket_id IN (SELECT id FROM storage.buckets WHERE public = true));