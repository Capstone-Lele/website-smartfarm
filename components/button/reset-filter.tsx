import { Button } from "@/components/ui/button";
import { RiResetRightLine } from "react-icons/ri";

interface ResetFilterButtonProps {
  onReset: () => void;
}

export const ResetFilterButton = ({ onReset }: ResetFilterButtonProps) => {
  return (
    <Button
      variant="outline"
      className="cursor-pointer flex items-center gap-2"
      type="button"
      onClick={onReset}
    >
      <RiResetRightLine />
      Reset Filter
    </Button>
  );
};
