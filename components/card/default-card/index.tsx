import { cn } from "@/lib/utils";
import React from "react";

const DefaultCard = ({
    children,
    className
}:{
    children: React.ReactNode;
    className?: string;
}) => {
  return <div className={cn("border p-4 rounded-md w-full bg-white", className)}>{children}</div>;
};

export default DefaultCard;
