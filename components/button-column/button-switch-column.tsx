import React from "react";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Spinner } from "../ui/spinner";

const ButtonSwitchColumn = ({
  isActive,
  isDisabled,
  onCheckedChange,
  isLoading,
}: {
  isActive: boolean;
  isDisabled?: boolean;
  onCheckedChange?: () => void;
  isLoading?: boolean;
}) => {
  return (
    <div className="flex items-center space-x-2">
      {isLoading ? (
        <Spinner />
      ) : (
        <Switch
          id="airplane-mode"
          checked={isActive}
          disabled={isDisabled}
          onCheckedChange={onCheckedChange}
        />
      )}
      <Label htmlFor="airplane-mode">{isActive ? "Aktif" : "Non-Aktif"}</Label>
    </div>
  );
};

export default ButtonSwitchColumn;
