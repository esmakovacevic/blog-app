"use client";
import { useState } from "react";

import { supabase } from "../lib/supabase";
import { useRouter } from "next/navigation";
import Input from "../components/Input";
import Button from "../components/Button";
import Link from "next/link";
import validator from "validator";
export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const handleSignup = async (e) => {
    e.preventDefault();
  
    if (!email || !password) {
      console.log("Please enter your email and password.");
      return;
    }
    if (!validator.isStrongPassword(password)){
      alert('Invalid password. At least 8 char, upperCase, lowerCase, number and sign.')
      return;
    }
    if(!validator.isEmail(email)){
      alert('Not correct email')
      return;
    }
    try {
      const { user, error } = await supabase.auth.signUp({
        email,
        password,
      });
  
      if (error) {
        console.error("Error signing up:", error.message);
      } else {
        // dodavanje korisnika u  roles tabelu sa 'user' rolom
        const { data, error: insertError } = await supabase
          .from("roles")
          .insert([{ email, role: "user" }]);
  
        if (insertError) {
          console.error("Error inserting user role:", insertError.message);
        } else {
          console.log("User role inserted successfully:", data);
        }
  
        router.push("/");
      }
    } catch (error) {
      console.error("Error signing up:", error.message);
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
