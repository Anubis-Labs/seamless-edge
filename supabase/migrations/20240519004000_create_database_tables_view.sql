-- Create a view for public tables that can be queried directly
CREATE OR REPLACE VIEW public.database_tables AS
SELECT 
  table_schema::text as schema_name,
  table_name::text as table_name,
  table_type::text as table_type
FROM 
  information_schema.tables
WHERE 
  table_schema = 'public' AND
  table_type = 'BASE TABLE'
ORDER BY 
  table_name;

-- Grant select permission to authenticated users
GRANT SELECT ON public.database_tables TO authenticated; 