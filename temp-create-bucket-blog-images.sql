INSERT INTO storage.buckets (id, name, public)
      VALUES ('blog-images', 'blog-images', true)
      ON CONFLICT (id) DO UPDATE
      SET public = true;