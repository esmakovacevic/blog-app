import { supabase } from "@/app/lib/supabase";
import { NextResponse } from "next/server";

import validator from "validator";

// /api/form/route.js
export async function POST(request) {
  try {
    const { title, subtitle, text } = await request.json();

    // Validation
    if (!validator.isLength(title, { min: 1 })) {
      throw new Error('Invalid title length');
    }
    if (!validator.isLength(subtitle, { min: 1})) {
      throw new Error('Invalid subtitle length');
    }
    if (!validator.isLength(text, { min: 1 })) {
      throw new Error('Invalid text length');
    }

    // Sanitization and HTML escaping
    const sanitizedTitle = validator.escape(validator.trim(title));
    const sanitizedSubtitle = validator.escape(validator.trim(subtitle));
    const sanitizedText = validator.escape(validator.trim(text));

    // Insert the sanitized values into the database
    const { data, error } = await supabase.from('posts').insert({
      title: sanitizedTitle,
      subtitle: sanitizedSubtitle,
      text: sanitizedText,
    });
    if (error) {
      throw error;
    }

    return NextResponse.json({ title: sanitizedTitle, subtitle: sanitizedSubtitle, text: sanitizedText });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

