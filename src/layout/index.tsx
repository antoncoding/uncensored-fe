import React, { PropsWithChildren } from 'react';
import { ToastContainer } from 'react-toastify';

//Importing Components
import Navbar from './navbar';
import Footer from './footer';

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="wrapper">
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
      <Footer />
    </div>
  );
}
