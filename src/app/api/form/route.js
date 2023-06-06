import { supabase } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

import validator from "validator";

export async function POST(request,response) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const subtitle = formData.get("subtitle");
    const text = formData.get("text");
    const file  =formData.get("file");
    const email=formData.get("email");
    // Validation
    if (!validator.isLength(title, { min: 1 })) {
      throw new Error("Invalid title length");
    }
    if (!validator.isLength(subtitle, { min: 1 })) {
      throw new Error("Invalid subtitle length");
    }
    if (!validator.isLength(text, { min: 1 })) {
      throw new Error("Invalid text length");
    }

   // Sanitization and HTML escaping
   const sanitizedTitle = validator.escape(validator.trim(title));
   const sanitizedSubtitle = validator.escape(validator.trim(subtitle));
   const sanitizedText = validator.escape(validator.trim(text));



const { data: fileData, error: uploadError } = await supabase.storage
  .from("images")
  .upload(file.name, file, {
    contentType: file.type,
  });

    if (uploadError) {
      throw uploadError;
    }

    const fileUrl = fileData.path;

   
    const { data: postData, error: insertError } = await supabase
      .from("posts")
      .insert({
        title: sanitizedTitle,
        subtitle: sanitizedSubtitle,
        text: sanitizedText,
        email,
        file: fileUrl,
      });

    if (insertError) {
      throw insertError;
    }

    return NextResponse.json({ message: "Success" }, { status: 200 });
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
