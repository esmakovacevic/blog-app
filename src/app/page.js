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
import validator from "validator";
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

  // useEffect bavi preusmjrava korisnika na stranicu /posts ako imaju prijavljen racun,nfunkcija handleAuthStateChange ce biti pozvana s događajem koji označava
  //promjenu autentifikacijskog stanja tj
  //kada se korisnik prijavi, funkcija ce biti pozvana s vrijednoscu "SIGNED_IN" i slu
  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        router.replace("/posts");
      }
      if (event === "SIGNED_IN") {
        // console.log(session);
        //console.log("token " + session.access_token);
        //console.log("user " + session.user);
        //const expiresAt = new Date(session.expires_at * 1000); // Convert the Unix timestamp to JavaScript Date object
        //console.log("Access token will expire at:", expiresAt);
        router.push("/posts");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);
  //provjeravva unesene e-adrese i lozinke, a zatim poziva supabase.auth.signInWithPassword
  // da autentificira korisnika koristeci njihovu e-adresu i lozinku.
  //Ako je prijava  uspjesna, korisnik ce biti preusmjeren na stranicu /posts.

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      console.log("Please enter your email and password.");
      return;
    }

    if(!validator.isEmail(email)){
      alert('Not correct email')
      return;
    }
    try {
      
      const { error, user } = await supabase.auth.signInWithPassword(
        {
          email: email,
          password: password,
        },
        {
          persistSession: true, // korisnicka sesija se cuva,
          // i korisnik ce ostati prijavljen cak i ako
          // zatvori i ponovno otvori browser ili napusti aplikaciju
        }
      );

      if (error) {
        if (error.message === "Invalid login credentials") {
          alert("Invalid credentials");
          return;
        } else if (error.message === "Email not confirmed") {
          alert("Please confirm your email");
          return;
        } else {
          console.error("Error logging in:", error.message);
        }
      } else {
        // User successfullyd logged in
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
