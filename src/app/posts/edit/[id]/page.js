"use client";
import { supabase } from "../../../../../lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Edit({ params }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState(null);

  const router = useRouter();
  useEffect(() => {
    fetchPostData();
  }, []);

  const fetchPostData = async () => {
    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", params.id)
        .single();

      if (error) {
        console.error("Error fetching post:", error.message);
      } else {
        setTitle(data.title);
        setSubtitle(data.subtitle);
        setText(data.text);
      }
    } catch (error) {
      console.error("Error fetching post:", error.message);
    }
  };

  const handleUpdatePost = async (event) => {
    event.preventDefault();
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let email = user.email;
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token=session.access_token;
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("text", text);
      formData.append("id", params.id);
      formData.append("photo", photo);
      formData.append("email", email);

      const response = await fetch("/api/posts/update", {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        alert("Successfully updated");
        const data = await response.json();
        console.log(data);
      } else {
        console.log("Response status:", response.status);
        const errorData = await response.json();
        console.log("Error data:", errorData);
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error("Error updating post:", error.message);
    }
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };
  return (
    <div className="container">
      <h1>Edit Post</h1>
      <form encType="multipart/form-data">
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="subtitle">Subtitle:</label>
          <input
            type="text"
            id="subtitle"
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="text">Text:</label>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
          ></textarea>
        </div>
        <div>
          <p>File:</p>
          <input type="file" name="file" onChange={handlePhotoChange}></input>
        </div>
        <button onClick={handleUpdatePost}>Update</button>
      </form>
    </div>
  );
}
