-- Drop previous function if it exists
DROP FUNCTION IF EXISTS public.get_database_tables();

-- Create a new function with a dummy parameter to ensure RPC compatibility
CREATE OR REPLACE FUNCTION public.get_database_tables(dummy_param text DEFAULT NULL)
RETURNS TABLE (
  schema_name text,
  table_name text,
  table_type text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    table_schema::text as schema_name,
    table_name::text,
    table_type::text
  FROM 
    information_schema.tables
  WHERE 
    table_schema = 'public' AND
    table_type = 'BASE TABLE'
  ORDER BY 
    table_name;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_database_tables(text) TO authenticated; 