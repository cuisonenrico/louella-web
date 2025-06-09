"use client";

import { createClient } from "@/utils/supabase/client";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

export async function handleLogout(router: AppRouterInstance) {
  const supabase = createClient();
  await supabase.auth.signOut();
  router.push("/auth/login");
}