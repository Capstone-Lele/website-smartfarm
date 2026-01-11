"use client";

import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import Image from "next/image";
import { useState } from "react";

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
      <DialogContent className="max-w-7xl w-[95vw] p-0 overflow-hidden border-none bg-transparent">
        <div className="relative w-full h-[90vh] flex items-center justify-center">
          {/* Image Container */}
          <div className="relative w-full h-full flex items-center justify-center bg-black/90 rounded-lg">
            <Image
              src={imageUrl}
              alt={alt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 85vw"
              priority
            />
          </div>

          {/* Optional Title */}
          {title && (
            <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4 text-center">
              <p className="text-sm font-medium">{title}</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
