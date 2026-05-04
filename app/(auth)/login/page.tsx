"use client";

import LoginForm from "@/components/auth/LoginForm";
import SlideImage from "@/components/auth/SlideImage";
import { useSearchParams } from "next/navigation";
import { useEffect, Suspense } from "react";
import { toast } from "sonner";

const LoginContent = () => {
  const message = useSearchParams().get("message");

  useEffect(() => {
    if (
      message === "expired" ||
      message === "Session expired, please log in again"
    ) {
      toast.error("Sesi Anda telah kedaluwarsa. Silakan masuk kembali.", {
        duration: 5000,
      });
    }
  }, [message]);

  return (
    <>
      <LoginForm />
      <div className="hidden md:block">
        <SlideImage />
      </div>
    </>
  );
};

const page = () => {
  return (
    <main className="border w-full max-h-165 h-screen grid md:grid-cols-2 grid-cols-1">
      <Suspense fallback={<div>Loading...</div>}>
        <LoginContent />
      </Suspense>
    </main>
  );
};

export default page;
