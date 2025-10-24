import React from 'react';
import { ToastProvider } from '../../Toasts';
import RedditCommentsIsland from './RedditCommentsIsland';

interface CommentsWithToastProps {
  storyId: string;
}

const CommentsWithToast: React.FC<CommentsWithToastProps> = ({ storyId }) => {
  return (
    <ToastProvider>
      <RedditCommentsIsland storyId={storyId} />
    </ToastProvider>
  );
};

export default CommentsWithToast;
