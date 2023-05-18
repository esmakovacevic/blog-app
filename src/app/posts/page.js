"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

import Link from "next/link";

export default function Posts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) {
        console.error("Error fetching posts:", error.message);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="container">
      <h1>Posts</h1>
      <ul className="post-list">
        {posts.map((post) => (
          <div className="background">
            <Link href={`/posts/${post.id}`}>
              <li key={post.id}>
                <h2>{post.title}</h2>
                <p>{post.subtitle}</p>
              </li>
            </Link>
          </div>
        ))}
      </ul>
    </div>
  );
}
