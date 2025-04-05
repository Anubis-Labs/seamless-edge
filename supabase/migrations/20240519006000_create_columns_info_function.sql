-- Create a new function with a different name
CREATE OR REPLACE FUNCTION public.get_column_info(target_table text)
RETURNS TABLE (
  table_name text,
  column_name text,
  data_type text,
  is_nullable text,
  column_default text
) 
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT 
    c.table_name::text,
    c.column_name::text,
    c.data_type::text,
    c.is_nullable::text,
    c.column_default::text
  FROM 
    information_schema.columns c
  WHERE 
    c.table_schema = 'public' AND
    c.table_name = target_table
  ORDER BY 
    c.ordinal_position;
END;
$$;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION public.get_column_info(text) TO authenticated; 