-- Create a function to automatically create profiles for new users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, role, created_at, updated_at)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'name', 'User'),
    'admin',
    NOW(), 
    NOW()
  )
  ON CONFLICT (id) DO UPDATE
  SET name = EXCLUDED.name,
      updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a trigger to call this function when a user is created
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Note: Now use the Supabase dashboard to create a user with:
-- Email: davidhughes3d@gmail.com
-- Password: Seamles99!!
-- The trigger will automatically create a profile for this user
