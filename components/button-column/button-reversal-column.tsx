import React from "react";
import { TbArrowBackUpDouble } from "react-icons/tb";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";

const ButtonReversalColumn = ({
  onClick,
  disabled,
}: {
  onClick: () => void;
  disabled?: boolean;
}) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className="h-9 w-9 p-0 cursor-pointer hover:bg-primary-surface text-black disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={disabled}
          onClick={onClick}
        >
          <TbArrowBackUpDouble size={20} />
          <span className="sr-only">Reversal</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Reversal</TooltipContent>
    </Tooltip>
  );
};

export default ButtonReversalColumn;
