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
      <SheetTrigger>
        <ButtonAssignColumn />
      </SheetTrigger>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader className="border-b">
          <SheetTitle>Menetapkan Akses Petugas</SheetTitle>
          <SheetDescription>
            Menetapkan petugas untuk mengelola kolam{" "}
            <strong>{pool.name}.</strong>
          </SheetDescription>
        </SheetHeader>
        <div>isi content</div>
      </SheetContent>
    </Sheet>
  );
};

export default AssignPoolModal;
