"use client";
import "./globals.css";
import { Inter } from "next/font/google";
import { useState } from "react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({ children }) {
  // const [supabase] = useState(() => createBrowserSupabaseClient());
  // const router = useRouter();
  // useEffect(() => {
  //   const {
  //     data: { subscription },
  //   } = supabase.auth.onAuthStateChange(() => {
  //     router.refresh();
  //   });
  //   return () => {
  //     subscription.unsubscribe();
  //   };
  // }, [supabase, router]);
  // const signIn = () => {
  //   supabase.auth.signInWithPassword({
  //     email: "esmakovacevic2000@gmail.com",
  //     password: "esma123",
  //   });
  // };
  // const signUp = () => {
  //   supabase.auth.signUp({
  //     email: "esmakovacevic2000@gmail.com",
  //     password: "esma123",
  //   });
  // };
  // const signOut = () => {
  //   supabase.auth.signOut();
  // };
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* <button onClick={signIn}>Sign In</button>
        <button onClick={signUp}>Sign Up</button>
        <button onClick={signOut}>Sign Out</button> */}
        {children}
      </body>
    </html>
  );
}
