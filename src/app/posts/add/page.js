"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { supabase } from "../../../../lib/supabase";
import { useRouter } from "next/navigation";
import { useState } from "react";
import validator from "validator";

export default function Posts() {
  const router = useRouter();
  const [isPosting, setIsPosting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsPosting(true);
    const title = event.target.title.value;
    const text = event.target.text.value;
    const subtitle = event.target.subtitle.value;
    const file = event.target.file.files[0];
    const formData = new FormData();

    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("text", text);
    formData.append("file", file);

    const {
      data: { user },
    } = await supabase.auth.getUser();
    let email = user.email;
    console.log(email);
    formData.append("email", email);
    // // Validation
    if (!validator.isLength(title, { min: 1 })) {
      alert("Invalid title length");
      return;
    }
    if (!validator.isLength(subtitle, { min: 1 })) {
      alert("Invalid subtitle length");
      return;
    }
    if (!validator.isLength(text, { min: 1 })) {
      alert("Invalid text length");
      return;
    }
    console.log(file);

    try {
      const response = await fetch(`/api/form`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Handle success
        console.log(data);
        event.target.reset();
        setIsPosting(false);
        alert("Post added successfully!");
        router.push("/posts");
      } else {
        throw new Error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }

    // const { insertData, insertError } = await supabase
    //   .from("posts")
    //   .insert({ title, subtitle, text});

    // if (insertError) {
    //   console.error(insertError);
    //   return;
    // }

    // console.log(insertData);
    // event.target.reset();
    // alert("Post added successfully!");
  };
  return (
    <div className="mainaddwrap">
      <div className="addwrap">
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <p>Title</p>

          <Input
            className="inputAdd"
            type="text"
            name="title"
            placeholder="Write title.."
          />
          <p>Subtitle</p>
          <Input
            className="inputAdd"
            type="text"
            name="subtitle"
            placeholder="Write subtitle.."
          />
          <p>Text</p>
          <textarea
            className="input2"
            type="text"
            name="text"
            placeholder="Write text.."
          />
          <p>Picture</p>

          <div>
            <Input
              className="input"
              type="file"
              name="file"
              id="fileInput"
              style={{ display: "none" }}
              onChange={(e) => {
                const file = e.target.files[0];
                const url = URL.createObjectURL(file);
                document
                  .getElementById("previewImage")
                  .setAttribute("src", url);
                document.getElementById("previewImage").style.display = "block";
              }}
            />

            <Button
              className="choosepic"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("fileInput").click();
              }}
            >
              Choose Picture...
            </Button>
            <img
              id="previewImage"
              style={{ display: "none", height: "100px", width: "100px" }}
            />
          </div>
          <div className="button">
          <Button type="submit" className="button">
              Submit
            </Button>
          </div>
          {isPosting ?( <p>Posting...</p>):(<p></p>)}
        </form>
      </div>
    </div>
  );
}
