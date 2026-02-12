"use client";

import LoginForm from "@/components/auth/LoginForm";
import SlideImage from "@/components/auth/SlideImage";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";


const page = () => {
  const message = useSearchParams().get("message");

  useEffect(() => {
    if (message === "expired") {
      toast.error("Sesi Anda telah kedaluwarsa. Silakan masuk kembali.");
    }
  }, [message]);

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
