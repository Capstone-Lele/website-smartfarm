import React from "react";
import { BiTrashAlt } from "react-icons/bi";
import { LuTrash } from "react-icons/lu";
import { Tooltip, TooltipTrigger, TooltipContent } from "../ui/tooltip";

const ButtonDeleteColumn = () => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="h-9 w-9 p-0 cursor-pointer flex items-center justify-center text-red-600 hover:bg-red-100 rounded-md">
          <BiTrashAlt size={20} />
        </div>
      </TooltipTrigger>
      <TooltipContent>Hapus</TooltipContent>
    </Tooltip>
  );
};

export default ButtonDeleteColumn;
