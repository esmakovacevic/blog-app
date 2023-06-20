const { supabase } = require("../../../lib/supabase");
const validator = require("validator");

const getPosts= async (req, res) => {
    const email = req.email;

    try {
      const { data, error } = await supabase
        .from("posts")
        .select("*")

        .order("created_at", { ascending: false });

      if (error) {
        throw error;
      }

      return res.json(data);
    } catch (error) {
      console.error("Error fetching posts:", error.message);
      return res.status(500).json({ error: "Error fetching posts" });
    }
  };
const updatePost=
  
    async (req, res) => {
      const { title, subtitle, text, id } = req.body;
      const file = req.file;
      const email = req.email;

      console.log(title, subtitle, text, id, file);

      if (!validator.isLength(title, { min: 1 })) {
        return res.status(400).json({ error: "Naslov je obavezan" });
      }

      if (!validator.isLength(subtitle, { min: 1 })) {
        return res.status(400).json({ error: "Podnaslov je obavezan" });
      }

      if (!validator.isLength(text, { min: 1 })) {
        return res.status(400).json({ error: "Tekst je obavezan" });
      }

      try {
        // Escapiranje HTML znakova u tekstualnim poljima
        const sanitizedTitle = validator.escape(title);
        const sanitizedSubtitle = validator.escape(subtitle);
        const sanitizedText = validator.escape(text);

        const { data: fileData, error: uploadError } = await supabase.storage
          .from("images")
          .upload(file.originalname, file.buffer);

        if (uploadError) {
          throw uploadError;
        }

        const fileUrl = fileData.path;

        const { data: postData, error: insertError } = await supabase
          .from("posts")
          .update({
            title: sanitizedTitle,
            subtitle: sanitizedSubtitle,
            text: sanitizedText,
            email,
            file: fileUrl,
          })
          .eq("id", id)
          .eq("email", email);
        console.log(
          "poslije update: " + sanitizedSubtitle,
          sanitizedText,
          sanitizedTitle,
          fileUrl,
          email
        );
        console.log(postData);
        if (insertError) {
          console.log("supabase error: " + insertError);
          throw insertError;
        }

        res.json({
          title: sanitizedTitle,
          subtitle: sanitizedSubtitle,
          text: sanitizedText,
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Greška prilikom unosa podataka" });
      }
    }
  ;
 const deletePost= async (req, res) => {
    const postId = req.params.id;

    try {
      const { data: post, error: fetchError } = await supabase
        .from("posts")
        .select("file")
        .eq("id", postId)
        .single();

      if (fetchError) {
        console.error("Error fetching post:", fetchError.message);
        return;
      }

      //iybrisi  post iz db
      const { error: deleteError } = await supabase
        .from("posts")
        .delete()
        .eq("id", postId);

      if (deleteError) {
        console.error("Error deleting post:", deleteError.message);
        return;
      }
      console.log(post.file);
      // izbrisi file iz storage
      const { error: storageError } = await supabase.storage
        .from("images")
        .remove([post.file]);

      if (storageError) {
        console.error(
          "Error deleting file from storage:",
          storageError.message
        );
        return;
      }

      console.log("Post deleted successfully");

      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Error deleting post" });
    }
  };
  const createPost= async (req, res) => {
    const { title, subtitle, text, email } = req.body;
    const file = req.file;
    console.log(file);
    if (!validator.isLength(title, { min: 1 })) {
      return res.status(400).json({ error: "Naslov je obavezan" });
    }

    if (!validator.isLength(subtitle, { min: 1 })) {
      return res.status(400).json({ error: "Podnaslov je obavezan" });
    }

    if (!validator.isLength(text, { min: 1 })) {
      return res.status(400).json({ error: "Tekst je obavezan" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Email nije ispravan" });
    }

    try {
      // Escapiranje HTML znakova u tekstualnim poljima
      const sanitizedTitle = validator.escape(title);
      const sanitizedSubtitle = validator.escape(subtitle);
      const sanitizedText = validator.escape(text);

      const { data: fileData, error: uploadError } = await supabase.storage
        .from("images")
        .upload(file.originalname, file.buffer);

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

      res.json({
        title: sanitizedTitle,
        subtitle: sanitizedSubtitle,
        text: sanitizedText,
        email,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Greška prilikom unosa podataka" });
    }
  };

  module.exports={getPosts,updatePost,deletePost,createPost}