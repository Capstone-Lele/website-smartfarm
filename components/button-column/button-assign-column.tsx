import React from "react";
import { LuUserRoundPlus } from "react-icons/lu";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const ButtonAssignColumn = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="h-9 w-9 p-0 cursor-pointer hover:bg-primary-surface text-black flex items-center justify-center rounded-md">
          <LuUserRoundPlus size={20} />
        </div>
      </TooltipTrigger>
      <TooltipContent>Menetapkan Petugas</TooltipContent>
    </Tooltip>
  );
};

export default ButtonAssignColumn;
