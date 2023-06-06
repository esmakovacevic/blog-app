import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title");
    const subtitle = formData.get("subtitle");
    const text = formData.get("text");
    const photo = formData.get("photo");

    const { fileData } = await supabase.storage
      .from("images")
      .upload(photo.name, photo);

    const { data, error } = await supabase
      .from("posts")
      .update({ title, subtitle, text, file: photo.name })
      .eq("id", id);
    console.log("Update response error:", error);
    if (error) {
      throw error;
    }

    console.log("Post updated successfully.");
    return NextResponse.json({
      title,
      subtitle,
      text,
    });
  } catch (error) {
    console.log("Error:", error.message);
    return NextResponse.error(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
