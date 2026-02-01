"use client";
import React from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
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

import { Button } from "@/components/ui/button";
import { FiPlusCircle } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { LuSave } from "react-icons/lu";
import { RiResetRightLine } from "react-icons/ri";
import { Separator } from "@/components/ui/separator";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import z from "zod";
import { useCreateUnit } from "@/lib/api/service/master-data/unit/useUnit";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama satuan wajib diisi" }),
});

const PostUnitModal = () => {
  const unitMutation = useCreateUnit();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log("Submitting form with data:", data);
      const res = await unitMutation.mutateAsync(data);
      form.reset();
      console.log("Unit created:", res);
      toast.success("Satuan berhasil ditambahkan");
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal menambahkan satuan", {
        description: error?.message || "Silakan coba lagi.",
      });
    }
  };

  return (
    <Sheet>
      <SheetTrigger className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <FiPlusCircle />
        Tambah Satuan
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="border-b">
          <SheetTitle>Tambah Satuan</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk menambahkan satuan baru.
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
                      <FieldLabel htmlFor="name">Nama Satuan</FieldLabel>
                      <Input
                        id="name"
                        autoComplete="off"
                        placeholder="Contoh: kg"
                        {...field}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan nama satuan barang.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Field orientation="vertical">
                  {unitMutation.isPending ? (
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
  );
};

export default PostUnitModal;
