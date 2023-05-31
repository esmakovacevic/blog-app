import { supabase } from "@/app/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

import validator from "validator";

export async function POST(request) {
  try {
  
    const { title, subtitle, text, email ,filePath} = await request.json();
    console.log(filePath,title);
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

    const { data, error } = await supabase.from("posts").insert({
      title: sanitizedTitle,
      subtitle: sanitizedSubtitle,
      text: sanitizedText,
      email,
      file:filePath
    });
    if (error) {
      throw error;
    }
   
    return NextResponse.json({
     
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
