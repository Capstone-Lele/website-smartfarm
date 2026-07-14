"use client";

import OtpForm from "@/components/auth/OtpForm";
import SlideImage from "@/components/auth/SlideImage";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

const OtpContent = () => {
  const router = useRouter();
  const email = useSearchParams().get("email");

  useEffect(() => {
    // Jika tidak ada email (akses langsung tanpa melalui login), redirect ke login
    if (!email) {
      router.replace("/login");
    }
  }, [email, router]);

  if (!email) return null;

  return (
    <>
      <OtpForm email={email} />
      <div className="hidden md:block">
        <SlideImage />
      </div>
    </>
  );
};

const OtpPage = () => {
  return (
    <main className="border w-full max-h-165 h-screen grid md:grid-cols-2 grid-cols-1">
      <Suspense fallback={<div>Loading...</div>}>
        <OtpContent />
      </Suspense>
    </main>
  );
};

export default OtpPage;
