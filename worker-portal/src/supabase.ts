import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  "https://uyisdqwcblazmqawhgkq.supabase.co";

const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5aXNkcXdjYmxhem1xYXdoZ2txIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwNzk0MzMsImV4cCI6MjA5NDY1NTQzM30.2gibJgLBZN9imFKI9jdwc_ycCHgQM7RppL2n9A2OlQ8";

export const supabase =
  createClient(
    supabaseUrl,
    supabaseAnonKey
  );