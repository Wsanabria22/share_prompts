'use client';
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Profile from '@components/Profile';

const UserProfile = ({ params }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userId = params.id;
  const userName = searchParams.get('name');
  const [posts, setPosts] = useState([]);

  useEffect(() =>{
    const fetchPosts = async () => {
      const response = await fetch(`/api/users/${userId}/posts`);
      const data = await response.json();
      setPosts(data);
    }

    if(userId) fetchPosts();
  }, [userId])


  const handleEdit = (post) => {
    router.push(`/update-prompt?id=${post._id}`)
  };

  const handleDelete = async (post) => {
    const hasComfirmed = confirm("Are you sure you want to delete this prompt?");
    if(hasComfirmed) {
      try {
        await fetch(`/api/prompt/${post._id.toString()}`, { method: 'DELETE' });
        const filteredPosts = posts.filter((p) => p.ID !== post._id);
        setPosts(filteredPosts);
      } catch (error) {
        console.log('Failed to delete Prompt', error);
      }

    }
    // router.push(`/delete-prompt?id=${post._id}`)
  };

  return (
    <Profile
      name={userName}
      desc={`Welcome to ${userName} perzonalized profile page`}
      data={posts}
    />
  )
};

export default UserProfile;