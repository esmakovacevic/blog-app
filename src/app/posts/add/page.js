"use client";

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { supabase } from "@/app/lib/supabase";
import validator from "validator";

const handleSubmit = async (event) => {
  event.preventDefault();

  const title = event.target.title.value;
  const subtitle = event.target.subtitle.value;
  const text = event.target.text.value;
  
  const {
    data: { user },
  } = await supabase.auth.getUser()
  let email = user.email
  console.log(email)
  // Validation
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
 
  try {

    const response = await fetch(`/api/form`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, subtitle, text,email }),
    });
    if (response.ok) {
      const data = await response.json();
      // Handle success
      console.log(data);
      event.target.reset();
      alert("Post added successfully!");
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

export default function Posts() {
  return (
    <div className="mainaddwrap">
      <div className="addwrap">
        <form onSubmit={handleSubmit}>
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

          <div className="button">
            <Button type="submit" className="button">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
