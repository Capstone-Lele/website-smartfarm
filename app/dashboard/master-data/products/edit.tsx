"use client";
import React, { useEffect, useState } from "react";
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
import { Product } from "@/types/master-data/product.types";
import { Unit } from "@/types/master-data/unit.types";
import { toast } from "sonner";
import { useUpdateProduct } from "@/lib/api/service/master-data/product/useProduct";
import { useUnit } from "@/lib/api/service/master-data/unit/useUnit";
import { useCategory } from "@/lib/api/service/master-data/category/useCategory";
import { Combobox } from "@/components/combobox";
import { TYPE_PRODUCT } from "@/lib/constants/type-product";
import ButtonEditColumn from "@/components/button-column/button-edit-column";
import { getDirtyValues } from "@/lib/utils/get-dirty-value";

const formSchema = z.object({
  name: z.string().min(1, { message: "Nama product wajib diisi" }),
  category: z.string().min(1, { message: "Kategori product wajib diisi" }),
  unit: z.string().min(1, { message: "Satuan product wajib diisi" }),
  type: z.string().min(1, { message: "Tipe product wajib diisi" }),
});

const EditProductModal = ({ product }: { product: Product }) => {
  const productMutation = useUpdateProduct();
  const getUnitData = useUnit();
  const getCategoryData = useCategory();
  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: product.name,
      category: product.category,
      unit: product.unit,
      type: product.type,
    },
  });
  const watchType = form.watch("type");
  const watchCategory = form.watch("category");
  const { isDirty, dirtyFields } = form.formState;

  useEffect(() => {
    form.reset({
      name: product.name,
      category: product.category,
      unit: product.unit,
      type: product.type,
    });
  }, [product, form]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    // const dirtyData = getDirtyValues(dirtyFields, data) as z.infer<
    //   typeof formSchema
    // >;
    console.log("Dirty Data:", data);
    try {
      const res = await productMutation.mutateAsync({
        id: product.id,
        data: data,
      });
      form.reset();
      toast.success(res.message || "Produk berhasil diubah");
      setIsOpen(false);
    } catch (error: any) {
      toast.error("Gagal mengedit produk", {
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
          <SheetTitle>Edit Produk</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk mengedit produk.
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
                  name="type"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="type">Tipe Produk</FieldLabel>
                      <Combobox
                        data={TYPE_PRODUCT}
                        onValueChange={(val) => {
                          field.onChange(val);
                          // Reset kategori jika tipe berubah dan kategori tidak valid
                          if (
                            val === "inventory" &&
                            form.getValues("category")?.toLowerCase() ===
                              "pendanaan"
                          ) {
                            form.setValue("category", "");
                          }
                        }}
                        isLoading={productMutation.isPending}
                        name="Tipe"
                        selectedValue={field.value}
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
                <Controller
                  name="category"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="category">
                        Kategori Produk
                      </FieldLabel>
                      <Combobox
                        data={
                          getCategoryData.data?.data
                            .filter((category) => {
                              if (
                                watchType === "inventory" &&
                                category.name.toLowerCase() === "pendanaan"
                              ) {
                                return false;
                              }
                              return true;
                            })
                            .map((category) => ({
                              value: category.name,
                              label: category.name,
                            })) || []
                        }
                        onValueChange={(val) => {
                          field.onChange(val);
                          if (val.toLowerCase() === "pakan") {
                            form.setValue(
                              "unit",
                              getUnitData.data?.data.find(
                                (unit: Unit) =>
                                  unit.name.toLowerCase() === "kg",
                              )?.name || "kg",
                              { shouldDirty: true },
                            );
                          }
                        }}
                        isLoading={productMutation.isPending}
                        name="Kategori"
                        disable={!watchType}
                        selectedValue={field.value}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan kategori produk.{" "}
                          {!watchType && "Pilih Tipe Produk terlebih dahulu."}
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
                        data={
                          getUnitData.data?.data
                            .filter((unit: Unit) => {
                              if (
                                watchCategory?.toLowerCase() === "pakan" &&
                                unit.name.toLowerCase() !== "kg"
                              ) {
                                return false;
                              }
                              return true;
                            })
                            .map((unit: Unit) => ({
                              value: unit.name,
                              label: unit.name,
                            })) || []
                        }
                        onValueChange={field.onChange}
                        isLoading={productMutation.isPending}
                        name="Satuan"
                        selectedValue={field.value}
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

export default EditProductModal;
