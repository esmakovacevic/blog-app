"use client";

import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import Button from "./Button";

const { default: Link } = require("next/link");

const Navbar = () => {
  const router = useRouter();
  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      router.push("/");
    }
  };
  return (
    <div className="header">
      <div className="navlinks">
        <NavLink href="/posts">Home &nbsp;|</NavLink>
        <NavLink href="/posts/add">Add Blog</NavLink>
      </div>
      <div className="header-button">
        <Button className="button" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
    </div>
  );
};
const NavLink = ({ href, children }) => {
  return <Link href={href}>{children}</Link>;
};

export default Navbar;
