import Link from "next/link";
import React from "react";
import { LuArrowRightLeft, LuEye } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { GrTransaction } from "react-icons/gr";

const ButtonTransactionColumn = ({href}: {href: string}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className="h-9 w-9 p-0 cursor-pointer hover:bg-primary-surface text-black flex items-center justify-center rounded-md"
        >
          <LuArrowRightLeft size={20}  />
        </Link>
      </TooltipTrigger>
      <TooltipContent>
        Stok in/out
      </TooltipContent>
    </Tooltip>
  );
};

export default ButtonTransactionColumn;
