"use client";
import { useState } from "react";

import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import Input from "../components/Input";
import Button from "../components/Button";
import Link from "next/link";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignup = async (e) => {
    e.preventDefault();
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      console.error("Error signing up:", error.message);
    } else {
      router.push("/");
    }
  };

  return (
    <div className="signup">
      <h1>Signup</h1>
      <form onSubmit={handleSignup}>
        <Input
        className='input'
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
              className='input'
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="button-wrap">
        <Button className='button' type="submit">Sign up</Button>
        <Link href='/'>  <Button className='button' >Log In</Button></Link>
        </div>
      </form>
    </div>
  );
}
