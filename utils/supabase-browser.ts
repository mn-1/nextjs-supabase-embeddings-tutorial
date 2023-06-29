// フロントエンドでのみ使用するSupabase Clientを作成する

// Supabase Client
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { Database } from "./database.types";

export const createClient = () => createBrowserSupabaseClient<Database>();
