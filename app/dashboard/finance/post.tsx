import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { FiPlusCircle } from "react-icons/fi";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { LuSave } from "react-icons/lu";
import { RiResetRightLine } from "react-icons/ri";
import z from "zod";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  name: z.string().min(1, "Nama Buku wajib diisi"),
  capital_amount: z.number().min(0, "Modal Awal wajib diisi"),
  started_date: z.string().min(1, "Tanggal Mulai wajib diisi"),
  ended_date: z.string().min(1, "Tanggal Selesai wajib diisi"),
  status_book: z.string().min(1, "Status Buku wajib diisi"),
});

const PostFinanceModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      capital_amount: 0,
      started_date: "",
      ended_date: "",
      status_book: "open",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {};

  return (
    <>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          <FiPlusCircle />
          Tambah Buku Baru
        </SheetTrigger>
        <SheetContent className=" h-screen overflow-auto">
          <SheetHeader className="border-b">
            <SheetTitle>Tambah Buku Baru</SheetTitle>
            <SheetDescription>
              Isi form di bawah ini untuk menambahkan Buku baru.
            </SheetDescription>
          </SheetHeader>
          <div className="p-4">
            <form action="" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldSet>
                <FieldGroup>
                  <Controller
                    name="name"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="name">Nama Buku</FieldLabel>
                        <Input
                          id="name"
                          autoComplete="off"
                          placeholder="Contoh: Budi Santoso"
                          {...field}
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>
                            Masukkan nama buku.
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />

                  <Field orientation="vertical">
                    {isLoading ? (
                      <Button
                        disabled
                        className=" cursor-not-allowed mr-1 flex items-center"
                      >
                        <Spinner className="mr-2" />
                        Memproses...
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        className=" cursor-pointer mr-1 flex items-center"
                      >
                        <LuSave />
                        Simpan
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      className=" cursor-pointer flex items-center"
                      type="button"
                      onClick={() => form.reset()}
                    >
                      <RiResetRightLine />
                      Reset
                    </Button>
                  </Field>
                </FieldGroup>
              </FieldSet>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default PostFinanceModal;
