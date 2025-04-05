-- Create function to get column information for a table
CREATE OR REPLACE FUNCTION public.get_table_columns(table_name text)
RETURNS TABLE (
  table_name text,
  column_name text,
  data_type text,
  is_nullable text,
  column_default text
) 
LANGUAGE SQL
AS $$
  SELECT 
    c.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    c.column_default
  FROM 
    information_schema.columns c
  WHERE 
    c.table_schema = 'public' AND
    c.table_name = table_name
  ORDER BY 
    c.ordinal_position;
$$; 