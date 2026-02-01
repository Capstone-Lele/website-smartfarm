import React from "react";
import { TbPencilMinus } from "react-icons/tb";

const ButtonEditColumn = () => {
  return (
    <div className="h-9 w-9 p-0 cursor-pointer hover:bg-primary-surface text-black flex items-center justify-center rounded-md">
      <TbPencilMinus size={20} />
    </div>
  );
};

export default ButtonEditColumn;
