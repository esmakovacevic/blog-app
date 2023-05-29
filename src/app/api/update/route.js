export async function PUT(request) {
    try {
      const { title, subtitle, text, id } = await request.json();
  
      console.log("Updating post with ID:", id);
      console.log("Title: "+title);
      console.log("Subtitle: "+subtitle);
      console.log("Text: "+text);
      const { data, error } = await supabase
        .from("posts")
        .update({ title, subtitle, text })
        .eq("id", id);
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
      return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
  }