INSERT INTO storage.buckets (id, name, public)
      VALUES ('gallery-images', 'gallery-images', true)
      ON CONFLICT (id) DO UPDATE
      SET public = true;