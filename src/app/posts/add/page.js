'use client'

import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { supabase } from "@/app/lib/supabase";





const handleSubmit = async (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  const title = formData.get("title");
  const subtitle = formData.get("subtitle");
  const text = formData.get("text");

 
  const { insertData, insertError } = await supabase
    .from("posts")
    .insert({ title, subtitle, text});

  if (insertError) {
    console.error(insertError);
    return;
  }

  console.log(insertData);
  event.target.reset();
  alert("Post added successfully!");
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