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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Combobox } from "@/components/combobox";
import { useGetProducts } from "@/lib/api/service/master-data/product/useProduct";

const formSchema = z.object({
  product: z.string().min(1, { message: "Nama produk wajib dipilih" }),
  quantity: z
    .string()
    .min(1, { message: "Jumlah wajib diisi" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Jumlah harus berupa angka positif",
    }),
  pricePerItem: z
    .string()
    .min(1, { message: "Harga per item wajib diisi" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Harga harus berupa angka positif",
    }),
  totalPrice: z
    .string()
    .min(1, { message: "Total harga wajib diisi" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Total harga harus berupa angka positif",
    }),
  notes: z.string().optional(),
  transactionDate: z.date({ message: "Tanggal wajib diisi" }),
  image: z
    .any()
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/jpg"].includes(file?.type),
      { message: "Format file harus JPG atau PNG" },
    ),
});

const PostFinance = () => {
  const { data: productsData, isLoading: isLoadingProducts } = useGetProducts();
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const productOptions =
    productsData?.data?.map((product: any) => ({
      label: product.name,
      value: product.id,
    })) || [];

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      product: "",
      quantity: "",
      pricePerItem: "",
      totalPrice: "",
      notes: "",
      transactionDate: new Date(),
      image: undefined,
    },
  });

  const quantity = useWatch({ control: form.control, name: "quantity" });
  const pricePerItem = useWatch({ control: form.control, name: "pricePerItem" });

  useEffect(() => {
    const qty = Number(quantity);
    const price = Number(pricePerItem);
    if (!isNaN(qty) && !isNaN(price) && qty > 0 && price > 0) {
      form.setValue("totalPrice", (qty * price).toString(), {
        shouldValidate: true,
      });
    } else {
      form.setValue("totalPrice", "");
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
    try {
      console.log("Submit data:", data);
      form.reset();
      setImagePreview(null);
      toast.success("Catatan keuangan berhasil ditambahkan");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal menambahkan catatan", {
        description: error?.message || "Silakan coba lagi.",
      });
    }
  };

  const handleReset = () => {
    form.reset();
    setImagePreview(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <FiPlusCircle />
        Tambah Data
      </SheetTrigger>
      <SheetContent className="sm:max-w-2xl h-screen overflow-auto">
        <SheetHeader className="border-b pb-4 mb-4">
          <SheetTitle>Tambah Data Keuangan</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk mencatat data keuangan baru.
          </SheetDescription>
        </SheetHeader>
        <div className="px-4">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-x-4 gap-y-4">
                  
                  <Controller
                    name="transactionDate"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="transactionDate">
                          Tanggal Transaksi
                        </FieldLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="transactionDate"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal",
                                !field.value && "text-muted-foreground",
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "dd MMMM yyyy", {
                                  locale: localeId,
                                })
                              ) : (
                                <span>Pilih tanggal</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              captionLayout="dropdown"
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>
                            Tanggal transaksi terjadi.
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="product"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="product">
                          Produk / Kategori (Non-Inventaris)
                        </FieldLabel>
                        <Combobox
                          data={productOptions}
                          onValueChange={field.onChange}
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

                  {/* Quantity */}
                  <Controller
                    name="quantity"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="quantity">Jumlah</FieldLabel>
                        <Input
                          id="quantity"
                          type="number"
                          min={1}
                          step={1}
                          autoComplete="off"
                          placeholder="Contoh: 10"
                          {...field}
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>Jumlah item.</FieldDescription>
                        )}
                      </Field>
                    )}
                  />

                  {/* Price per item */}
                  <Controller
                    name="pricePerItem"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="pricePerItem">
                          Harga Per Item
                        </FieldLabel>
                        <InputGroup>
                          <InputGroupAddon align="inline-start">
                            Rp
                            <Separator orientation="vertical" className="h-6 mx-2" />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="pricePerItem"
                            type="number"
                            min={0}
                            step={100}
                            placeholder="Contoh: 50000"
                            {...field}
                          />
                        </InputGroup>
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>Harga satuan barang.</FieldDescription>
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
                        <FieldLabel htmlFor="totalPrice">Total Harga</FieldLabel>
                        <InputGroup>
                          <InputGroupAddon align="inline-start">
                            Rp
                            <Separator orientation="vertical" className="h-6 mx-2" />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="totalPrice"
                            type="number"
                            placeholder="Dihitung otomatis"
                            disabled
                            {...field}
                          />
                        </InputGroup>
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>Jumlah × Harga Per Item.</FieldDescription>
                        )}
                      </Field>
                    )}
                  />



                  <Controller
                    name="notes"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field className="col-span-2">
                        <FieldLabel htmlFor="notes">
                          Catatan Transaksi{" "}
                          <span className="text-muted-foreground font-normal">
                            (Opsional)
                          </span>
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
                      <Field className="col-span-2">
                        <FieldLabel htmlFor="image">Foto Bukti</FieldLabel>
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
                                Klik untuk upload foto bukti nota (JPG/PNG)
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

                <Field orientation="vertical" className="col-span-2 mt-6">
                  <Button
                    type="submit"
                    className="cursor-pointer mr-2 inline-flex items-center"
                  >
                    <LuSave size={16} className="mr-2" />
                    Simpan
                  </Button>
                  <Button
                    variant="outline"
                    className="cursor-pointer inline-flex items-center"
                    type="button"
                    onClick={handleReset}
                  >
                    <RiResetRightLine size={16} className="mr-2" />
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

export default PostFinance;
