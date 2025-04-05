INSERT INTO storage.buckets (id, name, public)
      VALUES ('testimonial-images', 'testimonial-images', true)
      ON CONFLICT (id) DO UPDATE
      SET public = true;