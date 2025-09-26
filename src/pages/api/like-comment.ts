// API endpoint for liking/unliking comments
export const prerender = false;

import type { APIRoute } from 'astro';
import { db } from '../../lib/firebase';
import { FieldValue } from 'firebase-admin/firestore';

export const POST: APIRoute = async ({ request }) => {
  console.log('❤️ Like Comment API Route iniciado');
  
  try {
    const { commentId } = await request.json();
    
    if (!commentId) {
      throw new Error('commentId is required');
    }
    
    console.log('❤️ Processing like for comment:', commentId);
    
    // Get the comment document
    const commentRef = db.collection('comments').doc(commentId);
    const commentDoc = await commentRef.get();
    
    if (!commentDoc.exists) {
      throw new Error('Comment not found');
    }
    
    const commentData = commentDoc.data();
    const currentLikedBy = commentData?.likedBy || [];
    const userId = 'anonymous'; // In a real app, this would come from auth
    
    // Check if user already liked this comment
    const userHasLiked = currentLikedBy.includes(userId);
    
    if (userHasLiked) {
      // Unlike: remove user from likedBy array and decrement likes
      await commentRef.update({
        likes: FieldValue.increment(-1),
        likedBy: FieldValue.arrayRemove(userId)
      });
      console.log('👎 Comment unliked');
    } else {
      // Like: add user to likedBy array and increment likes
      await commentRef.update({
        likes: FieldValue.increment(1),
        likedBy: FieldValue.arrayUnion(userId)
      });
      console.log('👍 Comment liked');
    }
    
    return new Response(
      JSON.stringify({
        success: true,
        action: userHasLiked ? 'unliked' : 'liked'
      }),
      { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('❌ Error in like comment API:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to process like'
      }),
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
};
