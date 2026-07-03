import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

interface PopupReversalProps {
  title: string;
  message: string;
  type: "warning" | "info" | "success" | "error";
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
}

const PopupReversal = ({
  title,
  message,
  type,
  onConfirm,
  onCancel,
  isLoading,
  isOpen,
  setOpen,
}: PopupReversalProps) => {
  const typeStyles = {
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    info: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    success: "bg-green-100 text-green-800 hover:bg-green-200",
    error: "bg-red-100 text-red-800 hover:bg-red-200",
  };

  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
          <div className="mt-10 flex items-center gap-2 border-t pt-4 -mx-6 px-6">
            <DialogClose asChild>
              <Button
                className="w-1/2 hover:bg-primary-surface cursor-pointer border hover:border-none"
                variant="ghost"
                disabled={isLoading}
                onClick={() => {
                  onCancel();
                  setOpen(false);
                }}
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              className={`w-1/2 cursor-pointer ${typeStyles[type]}`}
              variant="ghost"
              disabled={isLoading}
              onClick={handleConfirm}
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2" />
                  Loading...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PopupReversal;
