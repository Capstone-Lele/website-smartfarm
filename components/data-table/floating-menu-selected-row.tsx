"use client";

import { Separator } from "@radix-ui/react-separator";
import { useRef, useState } from "react";
import { CgClose } from "react-icons/cg";
import { Button } from "../ui/button";
import { LuDownload } from "react-icons/lu";
import { MdOutlineDragIndicator } from "react-icons/md";
import Draggable from "react-draggable";
import { ExportPreviewModal } from "./exports/export-preview-modal";

const FloatingMenuSelectedRow = ({ table }: { table: any }) => {
  const nodeRef = useRef(null);
  const [open, setOpen] = useState(false);

  const selectedRows = table.getSelectedRowModel().rows;

  return (
    <>
      <Draggable handle=".drag-handle" nodeRef={nodeRef}>
        <div
          ref={nodeRef}
          className="fixed border bottom-4 z-50 flex items-center bg-white shadow-lg rounded-md left-1/2 -translate-x-1/2"
        >
          <div className="flex items-center gap-4 px-4 py-2">
            <div className="font-medium flex items-center gap-1 text-sm">
              <span>{selectedRows.length}</span>
              <span>selected</span>
            </div>
            <Separator
              orientation="vertical"
              className="h-6 w-0.5 bg-gray-200"
            />
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => table.resetRowSelection()}
            >
              <CgClose className="mr-1" />
              Deselect
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="cursor-pointer"
              onClick={() => setOpen(true)}
            >
              <LuDownload className="mr-1" />
              Export PDF
            </Button>
          </div>
          <div className="drag-handle cursor-move flex items-center px-2 py-3 border-l bg-gray-50">
            <MdOutlineDragIndicator className="text-2xl text-gray-500" />
          </div>
        </div>
      </Draggable>

      {/* Modal preview — hanya render baris yang dipilih */}
      <ExportPreviewModal
        open={open}
        onClose={() => setOpen(false)}
        table={table}
        rows={selectedRows}
        title="Data Terpilih"
      />
    </>
  );
};

export default FloatingMenuSelectedRow;
