'use client'
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useRouter } from 'next/navigation';


export default function Posts() {
  const [posts, setPosts] = useState([]);
const router=useRouter();
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) {
        console.error('Error fetching posts:', error.message);
      } else {
        setPosts(data);
      }
    };

    fetchPosts();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error('Error signing out:', error.message);
    } else {
    router.push('/')
    }
  };

  return (
    <div>
      <h1>Posts</h1>
      <button onClick={handleSignOut}>Sign Out</button>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>{post.title}</li>
        ))}
      </ul>
    </div>
  );
}
