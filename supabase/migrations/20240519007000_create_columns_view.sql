-- Create a view for direct column information access
CREATE OR REPLACE VIEW public.database_columns AS
SELECT 
  table_schema::text as schema_name,
  table_name::text as table_name,
  column_name::text as column_name,
  data_type::text as data_type,
  is_nullable::text as is_nullable,
  column_default::text as column_default,
  ordinal_position::integer as ordinal_position
FROM 
  information_schema.columns
WHERE 
  table_schema = 'public';

-- Grant select permission
GRANT SELECT ON public.database_columns TO authenticated; 