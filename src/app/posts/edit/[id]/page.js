'use client'
import { supabase } from "@/app/lib/supabase";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";


export default function Edit({ params }) {
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [text, setText] = useState("");
const router=useRouter();
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
     const response=await fetch(`/api/update`,{
        method:'PUT',
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            title,
            subtitle,
            text,
            id:params.id,
          },),
          
     })
     if(response.ok){
        alert("Successfull updated");
router.push('/posts')
         }

 
       else {
        const errorData = await response.json();
        throw new Error(errorData.error);
      }
    } catch (error) {
      console.error("Error updating post:", error.message);
    }
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
      <button onClick={handleUpdatePost}>Update</button>
    </div>
  );
}