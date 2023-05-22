"use client";

import { supabase } from "@/app/lib/supabase";
import { useState } from "react";
import { useEffect } from "react";

const Post = ({ params }) => {
  const [form, setForm] = useState([]);

  useEffect(() => {
    getPosts();
  }, []);

  async function getPosts() {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", params.id)
      .single();
    console.log(data);
    if (error) {
      console.log(error);
      throw new Error("Error fetching data.");
    }
    setForm(data);
  }
  return (
    <div>
      {form.length === 0 ? (
        <p>No data found.</p>
      ) : (
        <div className="mainaddwrap">
          <div className="addwrap" key={form.id}>
            <h1>{form.title}</h1>
            <p>{form.subtitle}</p>
            <p>{form.text}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Post;
