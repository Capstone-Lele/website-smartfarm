import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { LuExternalLink } from "react-icons/lu";

const notFound = () => {
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
          <div className="text-6xl font-medium text-red-500 [text-shadow:0_0_20px_rgba(239,68,68,0.2),0_0_40px_rgba(239,68,68,0.2),0_0_60px_rgba(239,68,68,0.4)] sm:text-7xl md:text-8xl">
            404
          </div>

          <h1 className="bg-gradient-to-b from-neutral-900 to-neutral-600 bg-clip-text text-4xl font-semibold text-transparent dark:from-neutral-200 dark:to-neutral-500 sm:text-6xl md:text-7xl">
            Halaman Tidak Ditemukan :(
          </h1>

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
              className="min-w-[140px]"
            >
              <Link href="/contact">
                Laporkan Masalah
                <LuExternalLink className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default notFound;
