INSERT INTO storage.buckets (id, name, public)
      VALUES ('service-images', 'service-images', true)
      ON CONFLICT (id) DO UPDATE
      SET public = true;