import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ButtonAssignColumn from "@/components/button-column/button-assign-column";
import { Pool } from "@/types/pool.types";

const AssignPoolModal = ({ pool }: { pool: Pool }) => {
    const [isOpen, setIsOpen] = useState(false);


  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <ButtonAssignColumn />
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader className="border-b">
          <SheetTitle>Edit Kolam</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk mengedit kolam.
          </SheetDescription>
        </SheetHeader>
        <div>
            isi content
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AssignPoolModal;
