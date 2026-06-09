"use client";
import React, { useEffect } from "react";
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
import { TbPencilMinus } from "react-icons/tb";
import { Unit } from "@/types/master-data/unit.types";
import { toast } from "sonner";
import { useUpdateUnit } from "@/lib/api/service/master-data/unit/useUnit";
import ButtonEditColumn from "@/components/button-column/button-edit-column";
import { getDirtyValues } from "@/lib/utils/get-dirty-value";
import { useUpdateBuyer } from "@/lib/api/service/master-data/buyer/useBuyer";
import { TYPE_BUYER } from "@/lib/constants/tye-buyer";
import { Combobox } from "@/components/combobox";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama pembeli wajib diisi" }),
  type: z.string().min(1, { error: "Jenis pembeli wajib diisi" }),
  phone: z
    .string()
    .max(15, { error: "Nomor telepon maksimal 15 karakter" })
    .optional(),
  email: z.union([z.string().email({ error: "Email tidak valid" }), z.literal("")]).optional(),
  address: z.string().min(1, { error: "Alamat wajib diisi" }),
});

const EditBuyerModal = ({ buyer }: { buyer: any }) => {
  const buyerMutation = useUpdateBuyer();
  const [isOpen, setIsOpen] = React.useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: buyer.name || "",
      type: buyer.type || "",
      phone: buyer.phone || "",
      email: buyer.email || "",
      address: buyer.address || "",
    },
  });
  const { isDirty, dirtyFields } = form.formState;

  useEffect(() => {
    form.reset({
      name: buyer.name || "",
      type: buyer.type || "",
      phone: buyer.phone || "",
      email: buyer.email || "",
      address: buyer.address || "",
    });
  }, [buyer, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const dirtyData = getDirtyValues(dirtyFields, data) as z.infer<
      typeof formSchema
    >;
    try {
      const res = await buyerMutation.mutateAsync({
        id: buyer.id,
        data: data,
      });
      form.reset();
      toast.success(res.message || "Pembeli berhasil diubah");
      setIsOpen(false);
    } catch (error: any) {
      toast.error("Gagal mengedit pembeli", {
        description: error?.message || "Silakan coba lagi.",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger>
        <ButtonEditColumn />
      </SheetTrigger>
      <SheetContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <SheetHeader className="border-b">
          <SheetTitle>Edit Pembeli</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk mengedit pembeli.
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
                        selectedValue={field.value}
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
                  name="phone"
                  control={form.control}
                    render={({ field, fieldState }) => (
                        <Field>
                            <FieldLabel htmlFor="phone">Nomor Telepon</FieldLabel>
                            <Input
                                id="phone"
                                autoComplete="off"
                                placeholder="Contoh: 081234567890"
                                type="number"
                                {...field}
                            />
                            {fieldState.invalid ? (
                                <FieldError errors={[fieldState.error]} />
                            ) : (
                                <FieldDescription>
                                    Masukkan nomor telepon pembeli.
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
                                    Masukkan email pembeli.
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
                      disabled={!isDirty}
                      className=" cursor-pointer mr-1 flex items-center"
                    >
                      <LuSave />
                      Simpan Perubahan
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

export default EditBuyerModal;
