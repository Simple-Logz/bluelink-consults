// supabaseClient.js
// The project URL and public anon key are included in the browser bundle.
// Authorization must be enforced by RLS. Never put a service-role key here.
//
// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.
// See .env.example for the template.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl  = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey  = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Export null if env vars are missing so the app degrades gracefully
// instead of crashing with a confusing Supabase error.
export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;