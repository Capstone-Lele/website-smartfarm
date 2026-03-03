import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ButtonEditColumn from "@/components/button-column/button-edit-column";
import { InventorySubmission } from "@/types/inventory";

const EditSubmissionModal = ({ submission }: { submission: InventorySubmission }) => {
  const [isOpen, setIsOpen] = useState(false);
    
  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="">
        <ButtonEditColumn />
      </SheetTrigger>
      <SheetContent
        className="h-screen overflow-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="border-b">
          <SheetTitle>Edit Pengajuan</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk mengedit pengajuan.
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">
          {/* <form action="" onSubmit={form.handleSubmit(onSubmit)}></form> */}
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default EditSubmissionModal;
