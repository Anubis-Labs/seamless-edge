-- Create function to get available tables safely
CREATE OR REPLACE FUNCTION public.get_database_tables()
RETURNS TABLE (
  schema_name text,
  table_name text,
  table_type text
) 
LANGUAGE SQL
SECURITY DEFINER -- Run with definer's privileges to ensure access
AS $$
  SELECT 
    table_schema as schema_name,
    table_name,
    table_type
  FROM 
    information_schema.tables
  WHERE 
    table_schema = 'public' AND
    table_type = 'BASE TABLE'
  ORDER BY 
    table_name;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.get_database_tables() TO authenticated; 