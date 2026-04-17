"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface ButtonCopyProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  textToCopy: string;
  truncateLength?: number;
}

export function ButtonCopy({
  textToCopy,
  truncateLength,
  className,
  ...props
}: ButtonCopyProps) {
  const [isCopied, setIsCopied] = useState(false);

  const displayString =
    truncateLength && textToCopy.length > truncateLength
      ? `${textToCopy.substring(0, truncateLength)}...`
      : textToCopy;

  const handleCopy = async () => {
    if (!textToCopy) return;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "group inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 font-medium transition-colors cursor-pointer",
        "hover:bg-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        className,
      )}
      title="Copy to clipboard"
      {...props}
    >
      <span className="font-mono ">{displayString}</span>
      {isCopied ? (
        <Check className="h-4 w-4 text-green-500" />
      ) : (
        <Copy className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      )}
    </button>
  );
}
