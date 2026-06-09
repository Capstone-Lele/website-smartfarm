"use client";
import React, { useEffect, useState, useRef } from "react";
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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { FiPlusCircle } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { LuSave, LuUpload } from "react-icons/lu";
import { RiResetRightLine } from "react-icons/ri";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import z from "zod";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { DateTimePicker24h } from "@/components/date-picker/date-time-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/combobox";
import { useGetProducts } from "@/lib/api/service/master-data/product/useProduct";
import { INVENTORY_TRANSACTION_TYPE_OPTIONS } from "@/lib/constants/type-inventory";
import { usePostNonInventory } from "@/lib/api/service/finance/useFinance";
import { Product } from "@/types/master-data/product.types";
import PopupConfirmation from "@/components/popup-confimation";
import { formatNumber } from "@/lib/utils/format-number";

const TRANSACTION_IN_OUT_OPTIONS = [
  { label: "Pemasukan", value: "in" },
  { label: "Pengeluaran", value: "out" },
];

const formSchema = z.object({
  productId: z.string().min(1, { message: "Nama produk wajib dipilih" }),
  quantity: z.coerce
    .number({
      error: "Jumlah wajib diisi dan harus berupa angka",
    })
    .positive({ message: "Jumlah harus berupa angka positif" }),
  pricePerItem: z.coerce
    .number({
      error: "Harga per item wajib diisi dan harus berupa angka",
    })
    .positive({ message: "Harga harus berupa angka positif" }),
  totalPrice: z.coerce
    .number({
      error: "Total harga wajib diisi dan harus berupa angka",
    })
    .positive({ message: "Total harga harus berupa angka positif" }),
  notes: z
    .string({ message: "Catatan wajib diisi" })
    .min(1, { message: "Catatan wajib diisi" }),
  transactionDate: z.date({ message: "Tanggal wajib diisi" }),
  image: z
    .any()
    .refine(
      (file) => file instanceof File || (typeof window === "undefined" && file),
      {
        message: "Foto wajib diupload",
      },
    )
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/jpg"].includes(file?.type),
      { message: "Format file harus JPG atau PNG" },
    )
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Ukuran file maksimal 5MB",
    }),
  type: z.enum(["in", "out"], { message: "Tipe transaksi wajib dipilih" }),
  transactionType: z.enum(["grant", "non-grant"], {
    message: "Tipe transaksi harus dipilih",
  }),
});

const PostFinance = () => {
  const { data: productsData, isLoading: isLoadingProducts } = useGetProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [dialogConfirmationOpen, setDialogConfirmationOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const nonInventoryMutation = usePostNonInventory();
  const [selectedProductUnitName, setSelectedProductUnitName] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productId: "",
      quantity: "" as any,
      pricePerItem: "" as any,
      totalPrice: "" as any,
      notes: "",
      transactionDate: new Date(),
      image: undefined,
      type: "in",
      transactionType: "non-grant",
    },
  });

  const inOut = useWatch({ control: form.control, name: "type" });
  const quantity = useWatch({ control: form.control, name: "quantity" });
  const transactionType = useWatch({
    control: form.control,
    name: "transactionType",
  });
  const pricePerItem = useWatch({
    control: form.control,
    name: "pricePerItem",
  });
  const selectedProductId = useWatch({
    control: form.control,
    name: "productId",
  });

  const selectedProduct = productsData?.data?.find(
    (product: Product) => product.id === selectedProductId,
  );
  const isFundingCategory =
    selectedProduct?.category?.toLowerCase() === "pendanaan";

  const productOptions =
    productsData?.data
      ?.filter((product: Product) => {
        if (inOut === "in") {
          return (
            product.deletedAt === null &&
            product.type !== "inventory" &&
            product.category.toLowerCase() === "pendanaan"
          );
        } else {
          return (
            product.deletedAt === null &&
            product.type !== "inventory" &&
            product.category.toLowerCase() !== "pendanaan"
          );
        }
      })
      .map((product: Product) => ({
        label: product.name,
        value: product.id,
      })) || [];

  useEffect(() => {
    const qty = Number(quantity);
    const price = Number(pricePerItem);
    if (!isNaN(qty) && !isNaN(price) && qty > 0 && price > 0) {
      form.setValue("totalPrice", (qty * price) as any, {
        shouldValidate: true,
      });
    } else {
      form.setValue("totalPrice", "" as any);
    }
  }, [quantity, pricePerItem, form]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  useEffect(() => {
    if (!isOpen) {
      setImagePreview(null);
    }
  }, [isOpen]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    if (!dialogConfirmationOpen && !isSubmitting) {
      setDialogConfirmationOpen(true);
      return;
    }

    try {
      setIsSubmitting(true);
      const payload = {
        productId: data.productId,
        quantity: data.quantity,
        pricePerItem: data.pricePerItem,
        totalPrice: data.totalPrice,
        notes: data.notes,
        transactionDate: data.transactionDate.toISOString(),
        image: data.image,
        type: data.type,
        transactionType: data.transactionType,
      };
      await nonInventoryMutation.mutateAsync(payload);
      console.log("Submit data:", data);
      form.reset();
      setImagePreview(null);
      toast.success("Catatan non inventaris berhasil ditambahkan");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal menambahkan catatan", {
        description: error?.message || "Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
      setDialogConfirmationOpen(false);
    }
  };

  const handleReset = () => {
    form.reset();
    setImagePreview(null);
  };

  return (
    <>
      <PopupConfirmation
        title="Konfirmasi Penambahan Catatan Non-Inventaris"
        message="Apakah Anda yakin ingin menyimpan catatan keuangan ini? Pastikan semua informasi sudah benar."
        type="warning"
        onConfirm={() => {
          setIsSubmitting(true);
          form.handleSubmit(onSubmit)();
        }}
        onCancel={() => {
          toast("Penambahan dibatalkan");
        }}
        isLoading={isSubmitting}
        isOpen={dialogConfirmationOpen}
        setOpen={setDialogConfirmationOpen}
      />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          <FiPlusCircle />
          Catatan Non-Inventaris
        </SheetTrigger>
        <SheetContent className="sm:max-w-2xl h-screen overflow-auto">
          <SheetHeader className="border-b pb-4 mb-4">
            <SheetTitle>Tambah Catatan Non-Inventaris</SheetTitle>
            <SheetDescription>
              Isi form di bawah ini untuk mencatat data baru.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FieldSet>
                <FieldGroup>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-4">
                    <Controller
                      name="type"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field className="col-span-1">
                          <FieldLabel htmlFor="type">
                            Pemasukan / Pengeluaran
                          </FieldLabel>
                          <Combobox
                            data={TRANSACTION_IN_OUT_OPTIONS}
                            onValueChange={field.onChange}
                            name="Jenis Transaksi"
                            selectedValue={field.value}
                          />
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : (
                            <FieldDescription>
                              Tentukan arah arus dana.
                            </FieldDescription>
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="productId"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="productId">
                            Produk / Kategori (Non-Inventaris)
                          </FieldLabel>
                          <Combobox
                            data={productOptions}
                            onValueChange={(value) => {
                              field.onChange(value);
                              const product = productsData?.data?.find(
                                (p: Product) => p.id === value,
                              );
                              setSelectedProductUnitName(product?.unit || "");
                              if (
                                product?.category?.toLowerCase() === "pendanaan"
                              ) {
                                form.setValue("quantity", 1 as any, {
                                  shouldValidate: true,
                                });
                              }
                            }}
                            name="Produk"
                            selectedValue={field.value}
                            isLoading={isLoadingProducts}
                          />
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : (
                            <FieldDescription>
                              Masukan produk atau jenis transaksi.
                            </FieldDescription>
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="transactionDate"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <DateTimePicker24h
                          value={field.value}
                          onValueChange={field.onChange}
                          label="Tanggal Transaksi"
                          placeholder="Pilih tanggal"
                          description="Tanggal transaksi terjadi."
                          error={
                            fieldState.invalid ? fieldState.error : undefined
                          }
                        />
                      )}
                    />

                    <Controller
                      name="transactionType"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field className="col-span-1">
                          <FieldLabel htmlFor="transactionType">
                            Tipe Transaksi (Grant / Non-Grant)
                          </FieldLabel>
                          <Combobox
                            data={INVENTORY_TRANSACTION_TYPE_OPTIONS.filter(
                              (item: any) => {
                                if (inOut === "in") {
                                  return item.value !== "grant";
                                }
                                return item;
                              },
                            )}
                            onValueChange={field.onChange}
                            name="Tipe Transaksi"
                            selectedValue={field.value}
                          />
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : (
                            <FieldDescription>
                              Tipe dana transaksi.
                            </FieldDescription>
                          )}
                        </Field>
                      )}
                    />

                    {/* Quantity — hidden when product is funding category */}
                    {!isFundingCategory && (
                      <Controller
                        name="quantity"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel htmlFor="quantity">Jumlah</FieldLabel>
                            <InputGroup>
                              <InputGroupInput
                                id="quantity"
                                type="number"
                                min={1}
                                step={1}
                                autoComplete="off"
                                placeholder="Contoh: 10"
                                {...field}
                                value={field.value as number | string}
                              />
                              <InputGroupAddon align="inline-end">
                                <Separator
                                  orientation="vertical"
                                  className="h-6"
                                />
                                {selectedProductUnitName || "Unit"}
                              </InputGroupAddon>
                            </InputGroup>
                            {fieldState.invalid ? (
                              <FieldError errors={[fieldState.error]} />
                            ) : (
                              <FieldDescription>Jumlah item.</FieldDescription>
                            )}
                          </Field>
                        )}
                      />
                    )}

                    {/* Price per item — label changes to "Jumlah Pendanaan" for funding products */}
                    <Controller
                      name="pricePerItem"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field
                          className={
                            isFundingCategory ? "col-span-1 md:col-span-2" : ""
                          }
                        >
                          <FieldLabel htmlFor="pricePerItem">
                            {isFundingCategory
                              ? "Jumlah Pendanaan"
                              : "Harga Per Unit"}
                          </FieldLabel>
                          <InputGroup>
                            <InputGroupAddon align="inline-start">
                              Rp
                              <Separator
                                orientation="vertical"
                                className="h-6 mx-2"
                              />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="pricePerItem"
                              type="text"
                              placeholder={
                                isFundingCategory
                                  ? "Masukkan jumlah pendanaan"
                                  : "Contoh: 50.000"
                              }
                              {...field}
                              onChange={(e) => {
                                const val = e.target.value.replace(/\D/g, "");
                                field.onChange(val ? Number(val) : "");
                              }}
                              value={
                                field.value
                                  ? formatNumber(field.value as number | string)
                                  : ""
                              }
                            />
                          </InputGroup>
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : (
                            <FieldDescription>
                              {isFundingCategory
                                ? "Total dana yang diterima."
                                : "Harga unit produk."}
                            </FieldDescription>
                          )}
                        </Field>
                      )}
                    />

                    {/* Total Price (Auto calculated) */}
                    <Controller
                      name="totalPrice"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="totalPrice">
                            Total Harga
                          </FieldLabel>
                          <InputGroup>
                            <InputGroupAddon align="inline-start">
                              Rp
                              <Separator
                                orientation="vertical"
                                className="h-6 mx-2"
                              />
                            </InputGroupAddon>
                            <InputGroupInput
                              id="totalPrice"
                              type="text"
                              placeholder="Dihitung otomatis"
                              disabled
                              {...field}
                              value={
                                field.value
                                  ? formatNumber(field.value as number | string)
                                  : ""
                              }
                            />
                          </InputGroup>
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : (
                            <FieldDescription>
                              Jumlah × Harga Per Unit.
                            </FieldDescription>
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="notes"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field className="col-span-1 md:col-span-2">
                          <FieldLabel htmlFor="notes">
                            Catatan Transaksi
                          </FieldLabel>
                          <Input
                            id="notes"
                            autoComplete="off"
                            placeholder="Catatan tambahan (contoh: No Faktur 1234)"
                            {...field}
                          />
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : (
                            <FieldDescription>
                              Informasi lebih rinci soal transaksi.
                            </FieldDescription>
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="image"
                      control={form.control}
                      render={({
                        field: { onChange, value, ref: _ref, ...rest },
                        fieldState,
                      }) => (
                        <Field className="col-span-1 md:col-span-2">
                          <FieldLabel htmlFor="image">
                            {transactionType !== "grant"
                              ? "Foto Bukti Transaksi / Nota"
                              : "Foto Bukti Serah Terima"}
                          </FieldLabel>
                          <div
                            className="border-2 border-dashed rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-h-48 rounded object-contain"
                              />
                            ) : (
                              <>
                                <LuUpload
                                  size={24}
                                  className="text-muted-foreground"
                                />
                                <span className="text-sm text-muted-foreground">
                                  Klik untuk upload foto bukti (JPG/PNG)
                                </span>
                              </>
                            )}
                          </div>
                          <input
                            ref={fileInputRef}
                            id="image"
                            type="file"
                            accept="image/jpeg,image/png,image/jpg"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                onChange(file);
                                setImagePreview(URL.createObjectURL(file));
                              }
                            }}
                            {...rest}
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <div className="flex flex-col-reverse justify-end sm:flex-row gap-2 mt-6">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center"
                      type="button"
                      onClick={handleReset}
                    >
                      <RiResetRightLine size={16} className="mr-2" />
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto cursor-pointer inline-flex items-center justify-center"
                    >
                      <LuSave size={16} className="mr-2" />
                      Simpan
                    </Button>
                  </div>
                </FieldGroup>
              </FieldSet>
            </form>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default PostFinance;
