import { Separator } from "@radix-ui/react-separator";
import React, { useRef } from "react";
import { CgClose } from "react-icons/cg";
import { Button } from "../ui/button";
import { LuTrash } from "react-icons/lu";
import { LuDownload } from "react-icons/lu";
import { MdOutlineDragIndicator } from "react-icons/md";
import Draggable from "react-draggable";

const FloatingMenuSelectedRow = ({ table }: { table: any }) => {
  const nodeRef = useRef(null);

  return (
    <Draggable handle=".drag-handle" nodeRef={nodeRef}>
      <div
        ref={nodeRef}
        className="fixed border bottom-4 z-50 flex items-center bg-white  shadow-lg rounded-md left-1/2 transform -translate-x-1/2"
      >
        <div className="flex items-center gap-4 px-4 py-2">
          <div className="font-medium flex items-center gap-1">
            <span>{table.getSelectedRowModel().rows.length}</span>
            <span>selected</span>
          </div>
          <Separator orientation="vertical" className="h-6 w-0.5 bg-gray-200" />
          <div>
            <Button variant="outline" className="cursor-pointer">
              <CgClose className="mr-1" />
              Deselect
            </Button>
          </div>
          <div>
            <Button variant="outline" className="cursor-pointer">
              <LuDownload className="mr-1" />
              Export
            </Button>
          </div>
          <div>
            <Button
              variant="outline"
              className="cursor-pointer bg-red-100 text-red-600 border-red-600 hover:bg-red-200 hover:text-red-700"
            >
              <LuTrash className="mr-1" />
              Delete
            </Button>
          </div>
        </div>
        <div className="drag-handle cursor-move flex items-center gap-1 px-2 py-3 border-l bg-gray-50">
          <MdOutlineDragIndicator className="text-2xl text-gray-500" />
        </div>
      </div>
    </Draggable>
  );
};

export default FloatingMenuSelectedRow;
