"use client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { LuExternalLink } from "react-icons/lu";

const notFound = () => {
  const route = useRouter();

  return (
    <div className="flex min-h-screen w-full items-center justify-center  px-4 py-16 dark:bg-neutral-900">
      <div className="relative flex h-[50rem] w-[80%] items-center justify-center bg-white dark:bg-black ">
        <div
          className={cn(
            "absolute inset-0",
            "[background-size:100px_100px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
          )}
        />
        {/* Radial gradient for the container to give a faded look */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_1%,black)] dark:bg-black"></div>
        {/* Content */}
        <div className="relative z-20 flex flex-col items-center justify-center space-y-6 px-4 text-center">
          <Image 
            src={'/images/not-found.png'}
            alt="Not Found"
            width={400}
            height={300}
          />

          <p className="max-w-2xl text-base text-neutral-600 dark:text-neutral-400 sm:text-lg">
            Maaf, kami tidak dapat menemukan halaman yang Anda cari. Halaman
            tersebut mungkin telah dihapus, diubah namanya, atau tidak ada.
          </p>

          <div className="flex flex-col items-center gap-4 pt-4 sm:flex-row">
            <Button asChild size="lg" className="min-w-[140px] hover:shadow-lg">
              <Link href="/">
                {/* <Home className="mr-2 h-4 w-4" /> */}
                Kembali ke Beranda
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="min-w-[140px] cursor-pointer hover:shadow-lg"
            >
              <div onClick={() => route.back()}>
                Ke Halaman Sebelumnya
                <LuExternalLink className="ml-2 h-4 w-4" />
              </div>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default notFound;
