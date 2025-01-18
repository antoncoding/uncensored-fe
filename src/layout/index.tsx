import React, { PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';

//Importing Components
import Navbar from './navbar';
import { inter } from '../config/fonts';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className={`wrapper ${inter.className}`}>
      <Navbar />
      <main className="main px-0">{children}</main>
      <ToastContainer
        position="bottom-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}
