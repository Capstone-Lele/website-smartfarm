"use client";
import React, { useState } from "react";
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
import { TYPE_BUYER } from "@/lib/constants/tye-buyer";
import { useCreateBuyer } from "@/lib/api/service/master-data/buyer/useBuyer";
import { Combobox } from "@/components/combobox";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, { error: "Nama satuan wajib diisi" }),
  type: z.string().min(1, { error: "Jenis pembeli wajib diisi" }),
  phoneNumber: z
    .string()
    .max(15, { error: "Nomor telepon maksimal 15 karakter" })
    .optional(),
  email: z.string().email({ error: "Email tidak valid" }).optional(),
  address: z.string().min(1, { error: "Alamat wajib diisi" }),
});

const PostBuyerModal = () => {
  const buyerMutation = useCreateBuyer();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "",
      phoneNumber: "",
      email: "",
      address: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      console.log("Submitting form with data:", data);
      const res = await buyerMutation.mutateAsync(data);
      form.reset();
      console.log("Buyer created:", res);
      toast.success("Pembeli berhasil ditambahkan");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal menambahkan pembeli", {
        description: error?.message || "Silakan coba lagi.",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <FiPlusCircle />
        Tambah Pembeli
      </SheetTrigger>
      <SheetContent >
        <SheetHeader className="border-b">
          <SheetTitle>Tambah Pembeli</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk menambahkan pembeli baru.
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
                      <FieldLabel htmlFor="name">Nama Pembeli</FieldLabel>
                      <Input
                        id="name"
                        autoComplete="off"
                        placeholder="Contoh: John Doe"
                        {...field}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan nama pembeli.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="type">Jenis Pembeli</FieldLabel>
                      <Combobox
                        data={TYPE_BUYER}
                        onValueChange={field.onChange}
                        isLoading={buyerMutation.isPending}
                        name="Tipe"
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan tipe pembeli.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="phoneNumber"
                  control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="phoneNumber">Nomor Telepon</FieldLabel>
                            <Input
                                id="phoneNumber"
                                autoComplete="off"
                                placeholder="Contoh: 081234567890"
                                type="number"
                                {...field}
                            />
                            {fieldState.invalid ? (
                                <FieldError errors={[fieldState.error]} />
                            ) : (
                                <FieldDescription>
                                    Masukkan nomor telepon pembeli (opsional).
                                </FieldDescription>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="email"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="email">Email</FieldLabel>
                            <Input
                                id="email"
                                autoComplete="off"
                                placeholder="Contoh: john.doe@example.com"
                                {...field}
                            />
                            {fieldState.invalid ? (
                                <FieldError errors={[fieldState.error]} />
                            ) : (
                                <FieldDescription>
                                    Masukkan email pembeli (opsional).
                                </FieldDescription>
                            )}
                        </Field>
                    )}
                />
                <Controller
                    name="address"
                    control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="address">Alamat</FieldLabel>
                            <Textarea 
                                id="address"
                                autoComplete="off"
                                placeholder="Contoh: Jl. Merdeka No. 123"
                                {...field}
                            />  
                            {fieldState.invalid ? (
                                <FieldError errors={[fieldState.error]} />
                            ) : (
                                <FieldDescription>
                                    Masukkan alamat pembeli.
                                </FieldDescription>
                            )}
                        </Field>
                    )}
                />
                <Field orientation="vertical">
                  {buyerMutation.isPending ? (
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

export default PostBuyerModal;
