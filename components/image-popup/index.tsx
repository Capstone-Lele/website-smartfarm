"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";
import { Button } from "../ui/button";
import { LuCloudDownload } from "react-icons/lu";

interface ImagePopupProps {
  imageUrl: string;
  alt?: string;
  title?: string;
}

export function ImagePopup({
  imageUrl,
  alt = "Image",
  title,
}: ImagePopupProps) {
  const [open, setOpen] = useState(false);

  const handleDownload = async () => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `image-${Date.now()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Failed to download image:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div onClick={() => setOpen(true)} className="cursor-pointer">
          <Image
            src={imageUrl}
            alt={alt}
            width={50}
            height={50}
            className="object-cover rounded-md"
          />
        </div>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className=" bg-white/95 backdrop-blur-xl shadow-2xl p-0 max-w-3xl"
      >
        <DialogHeader className="px-4 py-4 border-b">
          <DialogTitle>Detail Image</DialogTitle>
        </DialogHeader>
        <div className="px-4 w-full h-fit max-h-[80vh] pb-4 space-y-4">
          <div className="flex h-full w-full items-center justify-center ">
            <Image
              src={imageUrl}
              alt={alt}
              height={400}
              width={600}
              className="object-cover rounded-md max-h-120 max-w-full h-full"
            />
          </div>
          <Button
            onClick={handleDownload}
            className="w-full flex items-center cursor-pointer"
          >
            <LuCloudDownload className="mr-2" />
            Download Image
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
