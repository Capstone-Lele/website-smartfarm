import React from "react";
import { TbPencilMinus } from "react-icons/tb";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const ButtonEditColumn = ({ disabled }: { disabled?: boolean }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div 
          className={`h-9 w-9 p-0 cursor-pointer ${disabled ? "cursor-not-allowed opacity-50" : "hover:bg-primary-surface"} text-black flex items-center justify-center rounded-md`}
        >
          <TbPencilMinus size={20} />
        </div>
      </TooltipTrigger>
      <TooltipContent>Edit</TooltipContent>
    </Tooltip>
  );
};

export default ButtonEditColumn;
