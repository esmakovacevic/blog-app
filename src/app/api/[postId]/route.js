import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";


export async function DELETE(request){
console.log(request)
    try {
      const url = new URL(request.url);
      const postId = url.pathname.split('/').pop();
      console.log('post ID:'+postId)
      const {data,error}=await supabase
      .from("posts")
      .delete()
      .eq("id",postId);
      console.log('delete response:', data, error);
      if (error) {
        throw error;
      } 
      return NextResponse.json({message: "Post deleted succesfully"});
    } catch (error) {
        return NextResponse.json({error:"Internal Server Error"},{status:500})
    }
}