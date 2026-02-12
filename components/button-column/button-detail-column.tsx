import Link from "next/link";
import React from "react";
import { LuEye } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const ButtonDetailColumn = (href: any) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className="h-9 w-9 p-0 cursor-pointer hover:bg-primary-surface text-black flex items-center justify-center rounded-md"
        >
          <LuEye size={20} />
        </Link>
      </TooltipTrigger>
      <TooltipContent>Detail</TooltipContent>
    </Tooltip>
  );
};

export default ButtonDetailColumn;
