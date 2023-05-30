"use client";
import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";

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
        console.log('from tablle" ' + data);
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

  const handleDeletePost = async (postId) => {
    // console.log(postId)
    //     try {
    //       const response=await fetch(`/api/${postId}`,{
    //         method:"DELETE",
    //         headers: {
    //           "Content-Type": "application/json",
    //         },
    //       });
    //     console.log(response);
    //       if (response.ok) {
    //         alert("Post deleted successfully")
    //         fetchPosts();
    //       }else{
    //         throw new Error("Failed to delete post")
    //       }
    //     } catch (error) {
    //       console.error("Error deleting post: ",error)
    //     }
    const { error } = await supabase.from("posts").delete().eq("id", postId);
    if (error) {
      console.error("Error deleting post:", error.message);
    } else {
      console.log("Post deleted successfully");
      // Refresh the post list after deletion
      fetchPosts();
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
