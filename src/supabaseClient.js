// supabaseClient.js
// Uses a public browser key. Private keys must never be used in this client.
//
// Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env.local file.
// See .env.example for the template.

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://kqjyubxrbjyvakpvcymc.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || "sb_publishable_yNpvKpFRVhqTs02wclmX6A_FJwhg_5c";

// Export null if env vars are missing so the app degrades gracefully
// instead of crashing with a confusing Supabase error.
export const supabase =
  supabaseUrl && supabaseKey
    ? createClient(supabaseUrl, supabaseKey)
    : null;