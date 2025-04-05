INSERT INTO storage.buckets (id, name, public)
      VALUES ('resumes', 'resumes', false)
      ON CONFLICT (id) DO UPDATE
      SET public = false;