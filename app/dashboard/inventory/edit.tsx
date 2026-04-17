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
import { RiResetRightLine } from "react-icons/ri";
import { toast } from "sonner";
import { z } from "zod";
import { useUpdateInventory } from "@/lib/api/service/inventory/useInventory";
import { useGetProducts } from "@/lib/api/service/master-data/product/useProduct";
import { Combobox } from "@/components/combobox";
import { LuSave } from "react-icons/lu";
import { Separator } from "@/components/ui/separator";
import { Product } from "@/types/master-data/product.types";
import { Inventory } from "@/types/inventory";
import ButtonEditColumn from "@/components/button-column/button-edit-column";

const formSchema = z.object({
  productId: z.string().min(1, { message: "Produk wajib dipilih" }),
  minQuantity: z.coerce
    .number()
    .int({ message: "Stok minimum harus berupa bilangan bulat" })
    .min(0, { message: "Stok minimum tidak boleh negatif" }),
});

const EditInventoryModal = ({ inventory }: { inventory: Inventory }) => {
  const inventoryMutation = useUpdateInventory();
  const { data: productsData, isLoading: isLoadingProducts } = useGetProducts();
  const [isOpen, setIsOpen] = useState(false);

  // Set initial unit string from inventory
  const [productUnits, setProductUnits] = useState<string>(
    inventory?.unit || ""
  );

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: inventory?.productId || "",
      minQuantity: Number(inventory?.minQuantity) || 0 as any,
    },
  });

  const { isDirty } = form.formState;

  useEffect(() => {
    form.reset({
      productId: inventory?.productId || "",
      minQuantity: Number(inventory?.minQuantity) || 0,
    });
    setProductUnits(inventory?.unit || "");
  }, [inventory, form]);

  const productOptions =
    productsData?.data
      ?.filter((product: Product) => product.type === "inventory")
      .map((product: any) => ({
        label: product.name,
        value: product.id,
      })) || [];

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      // Yang dikirim cuman minQuantity
      const updateData = {
        minQuantity: data.minQuantity,
      };

      await inventoryMutation.mutateAsync({
        id: inventory.id,
        data: updateData,
      });
      toast.success("Data inventaris berhasil diperbarui");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal mengedit inventaris", {
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
          <SheetTitle>Edit Inventaris</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk mengedit data inventaris.
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
                      {/* Disable combobox for edit */}
                      <Combobox
                        data={productOptions}
                        onValueChange={field.onChange}
                        name="Produk"
                        selectedValue={field.value}
                        isLoading={isLoadingProducts}
                        disable={true}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Produk tidak dapat diubah pada saat edit.
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
                          Ubah batas stok minimum untuk peringatan.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />

                <Field orientation="vertical">
                  {inventoryMutation.isPending ? (
                    <Button
                      className="cursor-not-allowed flex items-center"
                      type="submit"
                      disabled
                    >
                      <span className="loading loading-spinner mr-2"></span>
                      Menyimpan...
                    </Button>
                  ) : (
                    <Button 
                      className="cursor-pointer flex items-center" 
                      disabled={!isDirty} 
                      type="submit"
                    >
                      <LuSave className="mr-1" />
                      Simpan Perubahan
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    className="cursor-pointer flex items-center"
                    type="button"
                    onClick={() => form.reset()}
                  >
                    <RiResetRightLine className="mr-1" />
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

export default EditInventoryModal;
