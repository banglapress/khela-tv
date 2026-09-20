export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Schema is applied via supabase/sql migrations. Keep this untyped so the
// editorial desk tables are usable without a generated snapshot of any other
// production database.
export type Database = any
