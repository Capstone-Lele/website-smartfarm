"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { FiPlusCircle } from "react-icons/fi";
import { RiResetRightLine } from "react-icons/ri";
import { toast } from "sonner";
import { z } from "zod";
import { useCreateInventory } from "@/lib/api/service/inventory/useInventory";
import { useGetProducts } from "@/lib/api/service/master-data/product/useProduct";
import { Combobox } from "@/components/combobox";
import { LuPackage, LuSave } from "react-icons/lu";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/master-data/product.types";

const formSchema = z
  .object({
    productId: z.string().min(1, { message: "Produk wajib dipilih" }),
    totalQuantity: z.coerce
      .number()
      .int({ message: "Jumlah stok harus berupa bilangan bulat" })
      .min(0, { message: "Jumlah stok tidak boleh negatif" }),
    minQuantity: z.coerce
      .number()
      .int({ message: "Stok minimum harus berupa bilangan bulat" })
      .min(0, { message: "Stok minimum tidak boleh negatif" }),
  })
  .refine((data) => data.totalQuantity >= data.minQuantity, {
    message: "Jumlah stok harus lebih besar atau sama dengan stok minimum",
    path: ["totalQuantity"],
  });

const PostInventoryModal = () => {
  const inventoryMutation = useCreateInventory();
  const { data: productsData, isLoading: isLoadingProducts } = useGetProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [productUnits, setProductUnits] = useState<string>("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      totalQuantity: "" as any,
      minQuantity: "" as any,
    },
  });

  const productOptions =
    productsData?.data?.filter((product: Product) => product.type == "inventory").map((product: any) => ({
      label: product.name,
      value: product.id,
    })) || [];

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      await inventoryMutation.mutateAsync(data);
      form.reset();
      toast.success("Inventaris berhasil ditambahkan");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal menambahkan inventaris", {
        description: error?.message || "Silakan coba lagi.",
      });
    }
  };

  const handleProductChange = (field: any) => (value: string) => {
    field.onChange(value);
    const selectedProduct = productsData?.data?.find(
      (product: any) => product.id === value,
    );
    setProductUnits(selectedProduct?.unit || "");
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <FiPlusCircle />
        Tambah Inventaris
      </SheetTrigger>
      <SheetContent className="">
        <SheetHeader className="border-b">
          <SheetTitle>Tambah Inventaris</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk menambahkan inventaris baru.
          </SheetDescription>
        </SheetHeader>
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          <form action="" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet>
              <FieldGroup>
                <Controller
                  name="productId"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="Produk">Produk</FieldLabel>
                      <Combobox
                        data={productOptions}
                        onValueChange={handleProductChange(field)}
                        name="Produk"
                        isLoading={isLoadingProducts}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Pilih produk yang akan ditambahkan ke inventaris.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="totalQuantity"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="totalQuantity">
                        Jumlah Stok
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id="totalQuantity"
                          type="number"
                          placeholder="Contoh: 100"
                          autoComplete="off"
                          {...field}
                        />
                        <InputGroupAddon align={"inline-end"}>
                          <Separator orientation="vertical" className="h-6" />{" "}
                          {productUnits && (
                            <span className="text-sm text-gray-500">
                              {productUnits}
                            </span>
                          )}
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan jumlah stok saat ini.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />

                <Controller
                  name="minQuantity"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="minQuantity">
                        Stok Minimum
                      </FieldLabel>
                      <InputGroup>
                        <InputGroupInput
                          id="minQuantity"
                          type="number"
                          placeholder="Contoh: 10"
                          autoComplete="off"
                          {...field}
                        />
                        <InputGroupAddon align={"inline-end"}>
                          <Separator orientation="vertical" className="h-6" />
                          {productUnits && (
                            <span className="text-sm text-gray-500">
                              {productUnits}
                            </span>
                          )}
                        </InputGroupAddon>
                      </InputGroup>
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Masukkan stok minimum untuk peringatan.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />

                <Field orientation="vertical">
                  {inventoryMutation.isPending ? (
                    <Button
                      className="cursor-not-allowed"
                      type="submit"
                      disabled
                    >
                      <span className="loading loading-spinner"></span>
                      Menyimpan...
                    </Button>
                  ) : (
                    <Button className="cursor-pointer" type="submit">
                      <LuSave />
                      Simpan
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="cursor-pointer flex items-center"
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

export default PostInventoryModal;
