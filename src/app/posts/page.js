"use client";
import { useState, useEffect } from "react";
import { supabase } from "../../../lib/supabase";

import Link from "next/link";
import Button from "../components/Button";
import { useRouter } from "next/navigation";

export default function Posts() {
  const [posts, setPosts] = useState([]);
  const [userRole, setUserRole] = useState(null);

  const router = useRouter();
  useEffect(() => {
    fetchPosts();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // vracanje korisnigovg maila iz sesije
        const { email } = session.user;

        console.log("email " + session.user.email);
        // fetch  role povezane sa korisnikovim mailom iz roles tabele
        const { data, error } = await supabase
          .from("roles")
          .select("role")
          .eq("email", email)
          .single();
        if (error) {
          console.error("Error fetching user role:", error.message);
        } else {
          //postavljanje role u state
          setUserRole(data?.role);
        }
      } else {
        setUserRole(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchPosts = async () => {
    const token = await supabase.auth.getSession();
    const access_token = token.data.session.access_token;
    console.log(access_token)
    try {
      const response = await fetch("/api/posts/select", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      });
      const data = await response.json();
      if (response.error) {
        console.error("Error fetching posts:", response.error.message);
      } else {
        setPosts(data);
      }
    } catch (error) {
      console.error("Error fetching posts:", error.message);
    }
  };

  const handleDeletePost = async (postId) => {
    const token = await supabase.auth.getSession();
    const access_token = token.data.session.access_token;
    try {
      const response = await fetch(`/api/posts/${postId}`, { method: "DELETE" , headers: {
        Authorization: `Bearer ${access_token}`,
      },});

      if (!response.ok) {
        throw new Error("Error deleting post");
      } else {
        fetchPosts();
      }
    } catch (error) {
      console.error("Error deleting post:", error.message);
    }
  };
  const handleEditPost = (postId) => {
    router.push(`/posts/edit/${postId}`);
  };

  return (
    <div className="container">
      <h1>Posts</h1>
      <ul className="post-list">
        {posts.map((post) => (
          <div className="background" key={post.id}>
            <li>
              <Link href={`/posts/${post.id}`}>
                <h2>{post.title}</h2>
                <p>{post.subtitle}</p>
                <div className="image">
                  <img
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_STORAGE_URL}${post.file}`}
                    alt={post.title}
                    width={230}
                    height={225}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </Link>
              {userRole === "admin" && ( // rendanje  delete i edit buttona samo ako je user admin
                <div className="buttonhover">
                  <div className="button-overlay">
                    <Button
                      className="button"
                      style={{ color: "red" }}
                      onClick={() => handleDeletePost(post.id)}
                    >
                      Delete
                    </Button>
                    <Button
                      className="button"
                      onClick={() => handleEditPost(post.id)}
                    >
                      Edit
                    </Button>
                  </div>
                </div>
              )}
            </li>
          </div>
        ))}
      </ul>
    </div>
  );
}
