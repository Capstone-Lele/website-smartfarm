'use client';
import DefaultCard from "@/components/card/default-card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Search } from "lucide-react";
import React from "react";
import PostFinanceModal from "./post";
import { Separator } from "@/components/ui/separator";
import { BookCard } from "@/components/book-card";

const page = () => {
  return (
    <>
      <DefaultCard>
        <div className="flex justify-between items-center">
          <div>
            <InputGroup>
              <InputGroupInput
                placeholder="Cari buku..."
                // value={globalFilter ?? ""}
                // onChange={(event) => setGlobalFilter(event.target.value)}
                className="max-w-60"
              />
              <InputGroupAddon>
                <Search />
              </InputGroupAddon>
            </InputGroup>
          </div>
          <PostFinanceModal />
        </div>
        <Separator  className="my-4" />
        {/* Table content goes here */}
        <div className="grid grid-cols-3">
<BookCard
 />
        </div>
      </DefaultCard>
    </>
  );
};

export default page;
