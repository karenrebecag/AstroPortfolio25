import React from 'react';
import { ToastProvider } from '../../Toasts';
import GetInTouchIsland from './GetInTouchIsland';

interface GetInTouchWithToastProps {
  lang?: string;
}

const GetInTouchWithToast: React.FC<GetInTouchWithToastProps> = ({ lang = 'en' }) => {
  return (
    <ToastProvider>
      <GetInTouchIsland lang={lang} />
    </ToastProvider>
  );
};

export default GetInTouchWithToast;
