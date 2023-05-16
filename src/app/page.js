import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { headers, cookies } from "next/headers";

export default async function Home() {
  const supabase = createServerComponentSupabaseClient({
    headers,
    cookies,
  });
  const { data: posts } = await supabase
    .from("posts")
    .select("id,created_at,title,subtitle,text");
  return <pre>{JSON.stringify(posts, null, 2)}</pre>;
}
