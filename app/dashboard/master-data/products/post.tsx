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
import {
  useCreateUnit,
  useUnit,
} from "@/lib/api/service/master-data/unit/useUnit";
import { toast } from "sonner";
import { useCreateProduct } from "@/lib/api/service/master-data/product/useProduct";
import { useCategory } from "@/lib/api/service/master-data/category/useCategory";
import { Combobox } from "@/components/combobox";
import { Unit } from "@/types/master-data/unit.types";
import { TYPE_PRODUCT } from "@/lib/constants/type-product";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama product wajib diisi" }),
  category: z.string().min(1, { message: "Kategori product wajib diisi" }),
  unit: z.string().min(1, { message: "Satuan product wajib diisi" }),
  type: z.string().min(1, { message: "Tipe product wajib diisi" }),
});

const PostProductModal = () => {
  const productMutation = useCreateProduct();
  const getUnitData = useUnit();
  const getCategoryData = useCategory();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      category: "",
      unit: "",
      type: "",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    console.log("Submitting form with data:", data);
    try {
      console.log("Submitting form with data:", data);
      const res = await productMutation.mutateAsync(data);
      form.reset();
      console.log("Product created:", res);
      toast.success("Produk berhasil ditambahkan");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal menambahkan produk", {
        description: error?.message || "Silakan coba lagi.",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <FiPlusCircle />
        Tambah Produk
      </SheetTrigger>
      <SheetContent>
        <SheetHeader className="border-b">
          <SheetTitle>Tambah Produk</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk menambahkan Produk baru.
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
                      <FieldLabel htmlFor="name">Nama Produk</FieldLabel>
                      <Input
                        id="name"
                        autoComplete="off"
                        placeholder="Contoh: Bibit Lele"
                        {...field}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan nama produk.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="category">Kategori Produk</FieldLabel>
                      <Combobox
                        data={getCategoryData.data?.data.map((category) => ({
                          value: category.name,
                          label: category.name,
                        })) || []}
                        onValueChange={field.onChange}
                        isLoading={productMutation.isPending}
                        name="Kategori"
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan kategori produk.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Controller
                  name="unit"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="unit">Satuan Produk</FieldLabel>
                      <Combobox
                        data={getUnitData.data?.data.map((unit:Unit) => ({
                          value: unit.name,
                          label: unit.name,
                        })) || []}
                        onValueChange={field.onChange}
                        isLoading={productMutation.isPending}
                        name="Satuan"
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan satuan produk.
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
                      <FieldLabel htmlFor="type">Tipe Produk</FieldLabel>
                      <Combobox
                        data={TYPE_PRODUCT}
                        onValueChange={field.onChange}
                        isLoading={productMutation.isPending}
                        name="Tipe"
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan tipe produk.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />
                <Field orientation="vertical">
                  {productMutation.isPending ? (
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

export default PostProductModal;
