"use client";

import { createContext, useContext, useState } from "react";
import { createClient } from "../../utils/supabase-browser";

import type { SupabaseClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "../../utils/database.types";

type SupabaseContext = {
  supabase: SupabaseClient<Database>;
};

// コンテキスト
const Context = createContext<SupabaseContext>(null!);

// プロバイダー
export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [supabase] = useState(() => createClient()); // この関数は一度だけ実行される

  return (
    <Context.Provider value={{ supabase }}>
      <>{children}</>
    </Context.Provider>
  );
}

// Supabaseクライアント
export const useSupabase = () => useContext(Context);
