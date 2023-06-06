"use client";
import { supabase } from "@/app/lib/supabase";
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

  const handleUpdatePost = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      let email = user.email;
  
      const formData = new FormData();
      formData.append("title", title);
      formData.append("subtitle", subtitle);
      formData.append("text", text);
      formData.append("id", params.id);
      formData.append("photo", photo);
  
      const response = await fetch(`/api/update`, {
        method: "PUT",
        body: formData,
      });
  
      if (response.ok) {
        alert("Successfully updated");
        router.push("/posts");
  
        const data = await response.json();
        console.log(data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error("Error updating post:", error.message);
    }
  };
  // const handleUpdatePost = async () => {
  //   try {
  //     console.log(photo.name);
  //     if (photo) {
  //       const { fileData } = await supabase.storage
  //         .from("images")
  //         .upload(photo.name, photo);

  //       const { data, error } = await supabase
  //         .from("posts")
  //         .update({ title, subtitle, text, file: photo.name })
  //         .eq("id", params.id)

  //       console.log(data);
  //       if (error) {
  //         throw error;
  //       } else {
  //         alert("Data updated! ");
  //         router.push("/posts");
  //       }
  //     }
  //   } catch (error) {
  //     console.error("Error updating post:", error.message);
  //   }
  // };
  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    setPhoto(file);
  };
  return (
    <div className="container">
      <h1>Edit Post</h1>
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
        <label htmlFor="text">File: </label>
        <input type="file" name="file" onChange={handlePhotoChange}></input>
      </div>
      <button onClick={handleUpdatePost}>Update</button>
    </div>
  );
}
