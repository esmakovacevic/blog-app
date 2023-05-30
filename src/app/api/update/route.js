import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

export async function PUT(request) {
  try {
    const { title, subtitle, text, id, email } = await request.json();

    console.log("Updating post with ID:", id);
    console.log("Title: " + title);
    console.log("Subtitle: " + subtitle);
    console.log("Text: " + text);
    console.log("Email: " + email);
    //   const authToken = request.headers.get('Authorization');
    //   if (!authToken) {
    //     throw new Error('Authorization token is missing.');
    //   }
    //   console.log(authToken)

    // const {  error: authError } = await supabase.auth.getUser(authToken);
    // if (authError) {
    //   throw new Error('Invalid authorization token.');
    // }
    // const { data:{user}, e} = await supabase.auth.getUser(authToken);

    // if (user.email !== email) {
    //   throw new Error('User is not authorized to update the post.');
    // }
    const { data, error } = await supabase
      .from("posts")
      .update({ title, subtitle, text })
      .eq("id", id)
    
    console.log("Update response data:", data);
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
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
