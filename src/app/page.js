//import { createServerComponentSupabaseClient } from "@supabase/auth-helpers-nextjs";
//import { headers, cookies } from "next/headers";
"use client";
import Link from "next/link";
import Button from "./components/Button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "./lib/supabase";
import Input from "./components/Input";
import { useEffect } from "react";

export default function Home() {
  // const supabase = createServerComponentSupabaseClient({
  //   headers,
  //   cookies,
  // });
  // const { data: posts } = await supabase
  //   .from("posts")
  //   .select("id,created_at,title,subtitle,text");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      // Handle auth state changes
      console.log(session);
    });
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      console.log("Please enter your email and password.");
      return;
    }

    try {
      const { error, user } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        if (
          error.message === "Invalid login credentials" ||
          error.message === "No user found for this email"
        ) {
          alert("Invalid email or password. Please try again.");
        } else if (error.message === "Email not confirmed") {
          alert("Please confirm your email");
        } else {
          console.error("Error logging in:", error.message);
        }
      } else {
        // Korisnik uspjesno logovan
        router.push("/posts");
      }
    } catch (error) {
      console.error("Error logging in:", error.message);
    }
  };

  const handleGoogleLogIn = async () => {
    const { user, error } = await supabase.auth.signInWithOAuth({
      provider: "google",
    });

    if (error) {
      console.error(error);
    } else {
      router.push("/posts");

      // Listen for logout event
      // supabase.auth.onAuthStateChange((event, session) => {
      //   if (event === "SIGNED_OUT") {
      //     // Redirect back to the home page after logout
      //     router.push("/");
      //   }
      // });
    }
  };
  return (
    <div className="page">
      {
        //JSON.stringify(posts, null, 2)
      }
      <h1>Welcome to Blog App</h1>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <Input
          className="input"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="button">
          Log in
        </Button>
      </form>
      <p>If you are new please sign up</p>
      <Link href={"/signup"}>
        <Button className="button">Sign Up</Button>
      </Link>
      <Button onClick={handleGoogleLogIn}>Log in with Google</Button>
    </div>
  );
}
