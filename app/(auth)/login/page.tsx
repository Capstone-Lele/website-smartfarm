"use client";

import LoginForm from "@/components/auth/LoginForm";
import SlideImage from "@/components/auth/SlideImage";

const page = () => {
  return (
    <main className="border w-full max-h-165 h-screen grid md:grid-cols-2 grid-cols-1">
      <LoginForm />
      <div className="hidden md:block">
        <SlideImage />
      </div>
    </main>
  );
};

export default page;
