import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { Separator } from "@radix-ui/react-separator";
import { Spinner } from "../ui/spinner";

type PopupConfirmationProps = {
  title: string;
  message: string;
  type: "warning" | "info" | "success" | "error";
  onConfirm?: () => void;
  onCancel?: () => void;
  children: React.ReactNode;
  isLoading?: boolean;
};

const PopupConfirmation = ({
  title,
  message,
  type,
  onConfirm,
  onCancel,
  isLoading,
  children,
}: PopupConfirmationProps) => {
  const typeStyles = {
    warning: "bg-yellow-100 text-yellow-800 hover:bg-yellow-200",
    info: "bg-blue-100 text-blue-800 hover:bg-blue-200",
    success: "bg-green-100 text-green-800 hover:bg-green-200",
    error: "bg-red-100 text-red-800 hover:bg-red-200 border border-red-200 hover:border-none",
  };

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{message}</DialogDescription>
          <div className="mt-10 flex items-center gap-2 border-t pt-4 -mx-6 px-6">
            <DialogClose asChild>
              <Button
                className="w-1/2 hover:bg-primary-surface cursor-pointer border hover:border-none"
                variant={"ghost"}
                onClick={onCancel}
              >
                Cancel
              </Button>
            </DialogClose>
            {isLoading ? (
              <Button
                className={`w-1/2 cursor-not-allowed  ${typeStyles[type]}`}
                disabled
              >
                <Spinner className="mr-2" />
                Loading...
              </Button>
            ) : (
              <Button
                className={`w-1/2 cursor-pointer ${typeStyles[type]}`}
                variant={"ghost"}
                onClick={onConfirm}
              >
                Confirm
              </Button>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default PopupConfirmation;
