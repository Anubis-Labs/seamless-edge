

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;


CREATE EXTENSION IF NOT EXISTS "pgsodium";






COMMENT ON SCHEMA "public" IS 'standard public schema';



CREATE EXTENSION IF NOT EXISTS "pg_graphql" WITH SCHEMA "graphql";






CREATE EXTENSION IF NOT EXISTS "pg_stat_statements" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgcrypto" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "pgjwt" WITH SCHEMA "extensions";






CREATE EXTENSION IF NOT EXISTS "supabase_vault" WITH SCHEMA "vault";






CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";






CREATE OR REPLACE FUNCTION "public"."get_monthly_revenue"("last_n_months" integer DEFAULT 12) RETURNS TABLE("month" "text", "revenue" numeric)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT
    TO_CHAR(DATE_TRUNC('month', p.end_date), 'YYYY-MM') as month,
    COALESCE(SUM(p.total_cost), 0) as revenue
  FROM public.projects p
  WHERE 
    p.status = 'completed' AND 
    p.end_date IS NOT NULL AND
    p.end_date >= (CURRENT_DATE - (last_n_months || ' month')::INTERVAL)
  GROUP BY DATE_TRUNC('month', p.end_date)
  ORDER BY DATE_TRUNC('month', p.end_date);
END;
$$;


ALTER FUNCTION "public"."get_monthly_revenue"("last_n_months" integer) OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_project_status_counts"() RETURNS TABLE("status" "text", "count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT p.status, COUNT(*) as count
  FROM public.projects p
  GROUP BY p.status;
END;
$$;


ALTER FUNCTION "public"."get_project_status_counts"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."get_service_distribution"() RETURNS TABLE("service" "text", "count" bigint)
    LANGUAGE "plpgsql"
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COALESCE(p.service_type, 'Other') as service,
    COUNT(*) as count
  FROM public.projects p
  GROUP BY p.service_type;
END;
$$;


ALTER FUNCTION "public"."get_service_distribution"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."handle_new_user"() RETURNS "trigger"
    LANGUAGE "plpgsql" SECURITY DEFINER
    AS $$
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
$$;


ALTER FUNCTION "public"."handle_new_user"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_job_applications_updated_at_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_job_applications_updated_at_column"() OWNER TO "postgres";


CREATE OR REPLACE FUNCTION "public"."update_modified_column"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$;


ALTER FUNCTION "public"."update_modified_column"() OWNER TO "postgres";

SET default_tablespace = '';

SET default_table_access_method = "heap";


CREATE TABLE IF NOT EXISTS "public"."app_settings" (
    "id" bigint NOT NULL,
    "company_name" "text" DEFAULT 'Seamless Edge'::"text",
    "contact_email" "text",
    "contact_phone" "text",
    "business_hours" "text",
    "address" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."app_settings" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."app_settings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."app_settings_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."app_settings_id_seq" OWNED BY "public"."app_settings"."id";



CREATE TABLE IF NOT EXISTS "public"."blog_categories" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."blog_categories" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."blog_categories_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."blog_categories_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."blog_categories_id_seq" OWNED BY "public"."blog_categories"."id";



CREATE TABLE IF NOT EXISTS "public"."blog_posts" (
    "id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "slug" "text" NOT NULL,
    "content" "text",
    "excerpt" "text",
    "featured_image" "text",
    "author_id" "uuid",
    "category" "text",
    "tags" "jsonb" DEFAULT '[]'::"jsonb",
    "status" "text" DEFAULT 'draft'::"text",
    "published_at" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "summary" "text"
);


ALTER TABLE "public"."blog_posts" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."blog_posts_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."blog_posts_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."blog_posts_id_seq" OWNED BY "public"."blog_posts"."id";



CREATE TABLE IF NOT EXISTS "public"."bookings" (
    "id" bigint NOT NULL,
    "title" "text",
    "client_name" "text" NOT NULL,
    "client_email" "text",
    "client_phone" "text",
    "service_type" "text" NOT NULL,
    "start_time" timestamp with time zone NOT NULL,
    "end_time" timestamp with time zone NOT NULL,
    "status" "text" DEFAULT 'pending'::"text",
    "notes" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."bookings" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."bookings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."bookings_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."bookings_id_seq" OWNED BY "public"."bookings"."id";



CREATE TABLE IF NOT EXISTS "public"."clients" (
    "id" bigint NOT NULL,
    "first_name" "text" NOT NULL,
    "last_name" "text" NOT NULL,
    "email" "text",
    "phone" "text",
    "address" "text",
    "city" "text",
    "state" "text",
    "zip_code" "text",
    "company" "text",
    "notes" "text",
    "client_type" "text" DEFAULT 'individual'::"text",
    "status" "text" DEFAULT 'active'::"text",
    "source" "text",
    "last_contact_date" timestamp with time zone,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    "zip" "text"
);


ALTER TABLE "public"."clients" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."clients_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."clients_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."clients_id_seq" OWNED BY "public"."clients"."id";



CREATE TABLE IF NOT EXISTS "public"."job_applications" (
    "id" integer NOT NULL,
    "full_name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text" NOT NULL,
    "position" "text",
    "message" "text",
    "resume_url" "text",
    "job_id" integer,
    "status" "text" DEFAULT 'new'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "job_applications_status_check" CHECK (("status" = ANY (ARRAY['new'::"text", 'reviewing'::"text", 'interviewed'::"text", 'accepted'::"text", 'rejected'::"text"])))
);


ALTER TABLE "public"."job_applications" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."job_applications_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."job_applications_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."job_applications_id_seq" OWNED BY "public"."job_applications"."id";



CREATE TABLE IF NOT EXISTS "public"."jobs" (
    "id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "department" "text" NOT NULL,
    "location" "text" NOT NULL,
    "type" "text" NOT NULL,
    "experience" "text" NOT NULL,
    "description" "text" NOT NULL,
    "responsibilities" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "requirements" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "benefits" "jsonb" DEFAULT '[]'::"jsonb" NOT NULL,
    "posted_date" "date" DEFAULT CURRENT_DATE NOT NULL,
    "closing_date" "date",
    "featured" boolean DEFAULT false NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"(),
    CONSTRAINT "jobs_type_check" CHECK (("type" = ANY (ARRAY['Full-time'::"text", 'Part-time'::"text", 'Contract'::"text", 'Temporary'::"text", 'Seasonal'::"text"])))
);


ALTER TABLE "public"."jobs" OWNER TO "postgres";


ALTER TABLE "public"."jobs" ALTER COLUMN "id" ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME "public"."jobs_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);



CREATE TABLE IF NOT EXISTS "public"."messages" (
    "id" bigint NOT NULL,
    "name" "text" NOT NULL,
    "email" "text" NOT NULL,
    "phone" "text",
    "message" "text" NOT NULL,
    "source" "text" DEFAULT 'contact_form'::"text",
    "status" "text" DEFAULT 'new'::"text",
    "archived" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."messages" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."messages_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."messages_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."messages_id_seq" OWNED BY "public"."messages"."id";



CREATE TABLE IF NOT EXISTS "public"."profiles" (
    "id" "uuid" NOT NULL,
    "name" "text",
    "role" "text" DEFAULT 'admin'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."profiles" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."projects" (
    "id" bigint NOT NULL,
    "title" "text" NOT NULL,
    "description" "text",
    "client_id" bigint,
    "status" "text" DEFAULT 'pending'::"text",
    "start_date" timestamp with time zone,
    "end_date" timestamp with time zone,
    "total_cost" numeric(10,2),
    "service_type" "text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."projects" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."projects_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."projects_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."projects_id_seq" OWNED BY "public"."projects"."id";



CREATE TABLE IF NOT EXISTS "public"."settings" (
    "section" "text" NOT NULL,
    "key" "text" NOT NULL,
    "value" "text" NOT NULL,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."settings" OWNER TO "postgres";


CREATE TABLE IF NOT EXISTS "public"."testimonials" (
    "id" bigint NOT NULL,
    "client_name" "text" NOT NULL,
    "client_title" "text",
    "client_company" "text",
    "client_location" "text",
    "client_image" "text",
    "content" "text" NOT NULL,
    "rating" integer DEFAULT 5,
    "status" "text" DEFAULT 'pending'::"text",
    "service_type" "text",
    "display_on_homepage" boolean DEFAULT false,
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."testimonials" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."testimonials_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."testimonials_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."testimonials_id_seq" OWNED BY "public"."testimonials"."id";



CREATE TABLE IF NOT EXISTS "public"."user_settings" (
    "id" bigint NOT NULL,
    "user_id" "uuid",
    "email_notifications" boolean DEFAULT true,
    "dark_mode" boolean DEFAULT false,
    "default_calendar_view" "text" DEFAULT 'week'::"text",
    "created_at" timestamp with time zone DEFAULT "now"(),
    "updated_at" timestamp with time zone DEFAULT "now"()
);


ALTER TABLE "public"."user_settings" OWNER TO "postgres";


CREATE SEQUENCE IF NOT EXISTS "public"."user_settings_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "public"."user_settings_id_seq" OWNER TO "postgres";


ALTER SEQUENCE "public"."user_settings_id_seq" OWNED BY "public"."user_settings"."id";



ALTER TABLE ONLY "public"."app_settings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."app_settings_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."blog_categories" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."blog_categories_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."blog_posts" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."blog_posts_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."bookings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."bookings_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."clients" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."clients_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."job_applications" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."job_applications_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."messages" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."messages_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."projects" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."projects_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."testimonials" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."testimonials_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."user_settings" ALTER COLUMN "id" SET DEFAULT "nextval"('"public"."user_settings_id_seq"'::"regclass");



ALTER TABLE ONLY "public"."app_settings"
    ADD CONSTRAINT "app_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_categories"
    ADD CONSTRAINT "blog_categories_name_key" UNIQUE ("name");



ALTER TABLE ONLY "public"."blog_categories"
    ADD CONSTRAINT "blog_categories_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_slug_key" UNIQUE ("slug");



ALTER TABLE ONLY "public"."bookings"
    ADD CONSTRAINT "bookings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."clients"
    ADD CONSTRAINT "clients_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."job_applications"
    ADD CONSTRAINT "job_applications_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."jobs"
    ADD CONSTRAINT "jobs_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."messages"
    ADD CONSTRAINT "messages_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."settings"
    ADD CONSTRAINT "settings_pkey" PRIMARY KEY ("section", "key");



ALTER TABLE ONLY "public"."testimonials"
    ADD CONSTRAINT "testimonials_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_pkey" PRIMARY KEY ("id");



ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_user_id_key" UNIQUE ("user_id");



CREATE OR REPLACE TRIGGER "update_job_applications_updated_at" BEFORE UPDATE ON "public"."job_applications" FOR EACH ROW EXECUTE FUNCTION "public"."update_job_applications_updated_at_column"();



CREATE OR REPLACE TRIGGER "update_jobs_modtime" BEFORE UPDATE ON "public"."jobs" FOR EACH ROW EXECUTE FUNCTION "public"."update_modified_column"();



ALTER TABLE ONLY "public"."blog_posts"
    ADD CONSTRAINT "blog_posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "auth"."users"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."job_applications"
    ADD CONSTRAINT "job_applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "public"."jobs"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."profiles"
    ADD CONSTRAINT "profiles_id_fkey" FOREIGN KEY ("id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



ALTER TABLE ONLY "public"."projects"
    ADD CONSTRAINT "projects_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE SET NULL;



ALTER TABLE ONLY "public"."user_settings"
    ADD CONSTRAINT "user_settings_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE CASCADE;



CREATE POLICY "Admins can create job applications" ON "public"."job_applications" FOR INSERT WITH CHECK (("auth"."uid"() IN ( SELECT "auth"."uid"() AS "uid"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins can delete job applications" ON "public"."job_applications" FOR DELETE USING (("auth"."uid"() IN ( SELECT "auth"."uid"() AS "uid"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins can update job applications" ON "public"."job_applications" FOR UPDATE USING (("auth"."uid"() IN ( SELECT "auth"."uid"() AS "uid"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Admins can view all job applications" ON "public"."job_applications" FOR SELECT USING (("auth"."uid"() IN ( SELECT "auth"."uid"() AS "uid"
   FROM "public"."profiles"
  WHERE ("profiles"."role" = 'admin'::"text"))));



CREATE POLICY "Allow all operations for authenticated users" ON "public"."blog_posts" TO "authenticated" USING (true) WITH CHECK (true);



CREATE POLICY "Allow authenticated users full access to app_settings" ON "public"."app_settings" TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users full access to blog_categories" ON "public"."blog_categories" TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users full access to blog_posts" ON "public"."blog_posts" TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users full access to bookings" ON "public"."bookings" TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users full access to clients" ON "public"."clients" TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users full access to messages" ON "public"."messages" TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users full access to profiles" ON "public"."profiles" TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users full access to projects" ON "public"."projects" TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users full access to testimonials" ON "public"."testimonials" TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to delete from bookings" ON "public"."bookings" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to delete from clients" ON "public"."clients" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to delete from jobs" ON "public"."jobs" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to delete from settings" ON "public"."settings" FOR DELETE TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to insert into bookings" ON "public"."bookings" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to insert into clients" ON "public"."clients" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to insert into jobs" ON "public"."jobs" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to insert into settings" ON "public"."settings" FOR INSERT TO "authenticated" WITH CHECK (true);



CREATE POLICY "Allow authenticated users to select from bookings" ON "public"."bookings" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to select from clients" ON "public"."clients" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to select from jobs" ON "public"."jobs" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to select from settings" ON "public"."settings" FOR SELECT TO "authenticated" USING (true);



CREATE POLICY "Allow authenticated users to update bookings" ON "public"."bookings" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to update clients" ON "public"."clients" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to update jobs" ON "public"."jobs" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow authenticated users to update settings" ON "public"."settings" FOR UPDATE TO "authenticated" USING (true);



CREATE POLICY "Allow delete for authenticated users" ON "public"."settings" FOR DELETE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow insert for authenticated users" ON "public"."settings" FOR INSERT WITH CHECK (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow public read access to published posts" ON "public"."blog_posts" FOR SELECT TO "anon" USING (("status" = 'published'::"text"));



CREATE POLICY "Allow public to view jobs" ON "public"."jobs" FOR SELECT USING (true);



CREATE POLICY "Allow select for authenticated users" ON "public"."settings" FOR SELECT USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow update for authenticated users" ON "public"."settings" FOR UPDATE USING (("auth"."role"() = 'authenticated'::"text"));



CREATE POLICY "Allow users to manage their own settings" ON "public"."user_settings" TO "authenticated" USING (("auth"."uid"() = "user_id"));



CREATE POLICY "Any user can create a job application" ON "public"."job_applications" FOR INSERT WITH CHECK (true);



ALTER TABLE "public"."app_settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blog_categories" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."blog_posts" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."bookings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."clients" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."job_applications" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."jobs" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."messages" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."profiles" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."projects" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."settings" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."testimonials" ENABLE ROW LEVEL SECURITY;


ALTER TABLE "public"."user_settings" ENABLE ROW LEVEL SECURITY;




ALTER PUBLICATION "supabase_realtime" OWNER TO "postgres";


GRANT USAGE ON SCHEMA "public" TO "postgres";
GRANT USAGE ON SCHEMA "public" TO "anon";
GRANT USAGE ON SCHEMA "public" TO "authenticated";
GRANT USAGE ON SCHEMA "public" TO "service_role";




















































































































































































GRANT ALL ON FUNCTION "public"."get_monthly_revenue"("last_n_months" integer) TO "anon";
GRANT ALL ON FUNCTION "public"."get_monthly_revenue"("last_n_months" integer) TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_monthly_revenue"("last_n_months" integer) TO "service_role";



GRANT ALL ON FUNCTION "public"."get_project_status_counts"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_project_status_counts"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_project_status_counts"() TO "service_role";



GRANT ALL ON FUNCTION "public"."get_service_distribution"() TO "anon";
GRANT ALL ON FUNCTION "public"."get_service_distribution"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."get_service_distribution"() TO "service_role";



GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "anon";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."handle_new_user"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_job_applications_updated_at_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_job_applications_updated_at_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_job_applications_updated_at_column"() TO "service_role";



GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "anon";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "authenticated";
GRANT ALL ON FUNCTION "public"."update_modified_column"() TO "service_role";


















GRANT ALL ON TABLE "public"."app_settings" TO "anon";
GRANT ALL ON TABLE "public"."app_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."app_settings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."app_settings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."app_settings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."app_settings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."blog_categories" TO "anon";
GRANT ALL ON TABLE "public"."blog_categories" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_categories" TO "service_role";



GRANT ALL ON SEQUENCE "public"."blog_categories_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."blog_categories_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."blog_categories_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."blog_posts" TO "anon";
GRANT ALL ON TABLE "public"."blog_posts" TO "authenticated";
GRANT ALL ON TABLE "public"."blog_posts" TO "service_role";



GRANT ALL ON SEQUENCE "public"."blog_posts_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."blog_posts_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."blog_posts_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."bookings" TO "anon";
GRANT ALL ON TABLE "public"."bookings" TO "authenticated";
GRANT ALL ON TABLE "public"."bookings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."bookings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."bookings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."bookings_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."clients" TO "anon";
GRANT ALL ON TABLE "public"."clients" TO "authenticated";
GRANT ALL ON TABLE "public"."clients" TO "service_role";



GRANT ALL ON SEQUENCE "public"."clients_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."clients_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."clients_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."job_applications" TO "anon";
GRANT ALL ON TABLE "public"."job_applications" TO "authenticated";
GRANT ALL ON TABLE "public"."job_applications" TO "service_role";



GRANT ALL ON SEQUENCE "public"."job_applications_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."job_applications_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."job_applications_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."jobs" TO "anon";
GRANT ALL ON TABLE "public"."jobs" TO "authenticated";
GRANT ALL ON TABLE "public"."jobs" TO "service_role";



GRANT ALL ON SEQUENCE "public"."jobs_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."jobs_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."jobs_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."messages" TO "anon";
GRANT ALL ON TABLE "public"."messages" TO "authenticated";
GRANT ALL ON TABLE "public"."messages" TO "service_role";



GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."messages_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."profiles" TO "anon";
GRANT ALL ON TABLE "public"."profiles" TO "authenticated";
GRANT ALL ON TABLE "public"."profiles" TO "service_role";



GRANT ALL ON TABLE "public"."projects" TO "anon";
GRANT ALL ON TABLE "public"."projects" TO "authenticated";
GRANT ALL ON TABLE "public"."projects" TO "service_role";



GRANT ALL ON SEQUENCE "public"."projects_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."projects_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."projects_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."settings" TO "anon";
GRANT ALL ON TABLE "public"."settings" TO "authenticated";
GRANT ALL ON TABLE "public"."settings" TO "service_role";



GRANT ALL ON TABLE "public"."testimonials" TO "anon";
GRANT ALL ON TABLE "public"."testimonials" TO "authenticated";
GRANT ALL ON TABLE "public"."testimonials" TO "service_role";



GRANT ALL ON SEQUENCE "public"."testimonials_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."testimonials_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."testimonials_id_seq" TO "service_role";



GRANT ALL ON TABLE "public"."user_settings" TO "anon";
GRANT ALL ON TABLE "public"."user_settings" TO "authenticated";
GRANT ALL ON TABLE "public"."user_settings" TO "service_role";



GRANT ALL ON SEQUENCE "public"."user_settings_id_seq" TO "anon";
GRANT ALL ON SEQUENCE "public"."user_settings_id_seq" TO "authenticated";
GRANT ALL ON SEQUENCE "public"."user_settings_id_seq" TO "service_role";



ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON SEQUENCES  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON FUNCTIONS  TO "service_role";






ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "postgres";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "anon";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "authenticated";
ALTER DEFAULT PRIVILEGES FOR ROLE "postgres" IN SCHEMA "public" GRANT ALL ON TABLES  TO "service_role";






























RESET ALL;
