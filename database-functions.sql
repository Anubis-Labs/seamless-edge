-- Function to get all tables in the public schema
CREATE OR REPLACE FUNCTION get_tables()
RETURNS TABLE (
  table_name text
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT t.tablename::text
  FROM pg_catalog.pg_tables t
  WHERE t.schemaname = 'public'
  ORDER BY t.tablename;
END;
$$;

-- Function to get column information for a specific table
CREATE OR REPLACE FUNCTION get_column_info(target_table text)
RETURNS TABLE (
  table_name text,
  column_name text,
  data_type text,
  is_nullable text,
  column_default text
) LANGUAGE plpgsql SECURITY DEFINER AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.table_name::text,
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text,
    c.column_default::text
  FROM information_schema.columns c
  WHERE c.table_schema = 'public'
    AND c.table_name = target_table
  ORDER BY c.ordinal_position;
END;
$$;

-- Grant access to the functions
GRANT EXECUTE ON FUNCTION get_tables() TO authenticated;
GRANT EXECUTE ON FUNCTION get_column_info(text) TO authenticated;

-- Get all column info for debugging
SELECT 
  table_schema,
  table_name,
  column_name,
  data_type,
  is_nullable
FROM 
  information_schema.columns 
WHERE 
  table_schema = 'public'
ORDER BY 
  table_name, ordinal_position;

-- Get all tables for debugging
SELECT 
  schemaname, 
  tablename 
FROM 
  pg_catalog.pg_tables 
WHERE 
  schemaname = 'public'
ORDER BY 
  tablename; 