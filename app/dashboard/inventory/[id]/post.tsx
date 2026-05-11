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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { FiPlusCircle } from "react-icons/fi";
import {
  useInventory,
  usePostInventoryTransaction,
} from "@/lib/api/service/inventory/useInventory";
import { Input } from "@/components/ui/input";
import { LuSave, LuUpload } from "react-icons/lu";
import { RiResetRightLine } from "react-icons/ri";
import { Separator } from "@/components/ui/separator";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import z from "zod";
import { toast } from "sonner";
import { Combobox } from "@/components/combobox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useParams } from "next/navigation";
import { INVENTORY_TRANSACTION_TYPE_OPTIONS } from "@/lib/constants/type-inventory";
import { cn } from "@/lib/utils";
import { MdOutlineReceipt } from "react-icons/md";
import { useState, useRef } from "react";
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
import PopupConfirmation from "@/components/popup-confimation";
import { formatNumber } from "@/lib/utils/format-number";

const formSchema = z.object({
  quantity: z.coerce
    .number({
      error: "Jumlah wajib diisi dan harus berupa angka",
    })
    .positive({ message: "Jumlah harus berupa angka positif" }),
  notes: z.string().min(2, { message: "Catatan wajib diisi" }),
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
  transactionType: z.enum(["grant", "non-grant"], {
    message: "Tipe transaksi harus dipilih",
  }),
  // transaksi :]
  transactionDate: z.date({ message: "Tanggal transaksi wajib diisi" }),
  notesTransaction: z
    .string()
    .min(2, { message: "Catatan transaksi wajib diisi" }),
  imageTransaction: z
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
  pricePerItem: z.coerce
    .number({
      error: "Jumlah wajib diisi dan harus berupa angka",
    })
    .positive({ message: "Jumlah harus berupa angka positif" }),
  totalPrice: z.coerce
    .number({
      error: "Jumlah wajib diisi dan harus berupa angka",
    })
    .positive({ message: "Jumlah harus berupa angka positif" }),
});

const PostStockInOut = () => {
  const params = useParams();
  const inventoryId = params?.id as string;
  const [isOpen, setIsOpen] = useState(false);

  const { data: inventoryData } = useInventory();
  const unit =
    inventoryData?.data?.find((item) => item.id === inventoryId)?.unit || "";
  const postInventoryTransaction = usePostInventoryTransaction();

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageTransactionPreview, setImageTransactionPreview] = useState<
    string | null
  >(null);

  const [dialogConfirmationOpen, setDialogConfirmationOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const fileInputRefTransaction = useRef<HTMLInputElement>(null);

  const form = useForm({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      transactionDate: new Date(),
      quantity: "" as any,
      notes: "",
      transactionType: "non-grant" as const,
      image: undefined,
      notesTransaction: "",
      imageTransaction: undefined,
      pricePerItem: "" as any,
      totalPrice: "" as any,
    },
  });

  const transactionType = useWatch({
    control: form.control,
    name: "transactionType",
  });
  const isNonGrant = transactionType === "non-grant";

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const dataPrep = {
      reportDate: data.transactionDate
        ? format(data.transactionDate, "yyyy-MM-dd")
        : undefined,
      quantity: data.quantity,
      transactionType: data.transactionType,
      notes: data.notes,
      image: data.image,
      pricePerItem: data.pricePerItem,
      totalPrice: data.totalPrice,
      transactionNotes: data.notesTransaction,
      transactionImage: data.imageTransaction,
      inventoryId: inventoryId,
    };
    if (!dialogConfirmationOpen && !isSubmitting) {
      setDialogConfirmationOpen(true);
      return;
    }
    try {
      console.log("Submit data:", dataPrep);
      await postInventoryTransaction.mutateAsync(dataPrep);
      form.reset();
      setImagePreview(null);
      setImageTransactionPreview(null);
      toast.success("Stok berhasil diperbarui");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal memperbarui stok", {
        description: error?.message || "Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
      setDialogConfirmationOpen(false);
    }
  };

  const pricePerItem = useWatch({
    control: form.control,
    name: "pricePerItem",
  });
  const quantity = useWatch({ control: form.control, name: "quantity" });

  useEffect(() => {
    const price = Number(pricePerItem);
    const qty = Number(quantity);
    if (!isNaN(price) && !isNaN(qty) && price > 0 && qty > 0) {
      form.setValue("totalPrice", price * qty, {
        shouldValidate: true,
      });
    } else {
      form.setValue("totalPrice", "");
    }
  }, [pricePerItem, quantity]);

  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      if (imageTransactionPreview) URL.revokeObjectURL(imageTransactionPreview);
    };
  }, [imagePreview, imageTransactionPreview]);

  useEffect(() => {
    if (!isOpen) {
      setImagePreview(null);
      setImageTransactionPreview(null);
    }
  }, [isOpen]);

  const handleReset = () => {
    form.reset();
    setImagePreview(null);
    setImageTransactionPreview(null);
  };

  return (
    <>
      <PopupConfirmation
        title="Konfirmasi Penambahan Stok"
        message="Apakah Anda yakin ingin menambahkan stok dengan data yang telah diisi? Pastikan semua informasi sudah benar karena data yang sudah disimpan tidak dapat diubah lagi."
        type="warning"
        onConfirm={() => {
          setIsSubmitting(true);
          form.handleSubmit(onSubmit)();
        }}
        onCancel={() => {
          toast("Penambahan stok dibatalkan");
        }}
        isLoading={postInventoryTransaction.isPending}
        isOpen={dialogConfirmationOpen}
        setOpen={setDialogConfirmationOpen}
      />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          <FiPlusCircle />
          Tambah Stok
        </SheetTrigger>
        <SheetContent className="sm:max-w-2xl h-screen overflow-auto">
          <SheetHeader className="border-b">
            <SheetTitle>Tambah Stok</SheetTitle>
            <SheetDescription>
              Isi form di bawah ini untuk menambahkan stok.
            </SheetDescription>
          </SheetHeader>
          <div className="p-4">
            <form action="" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldSet>
                <FieldGroup>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                    <Controller
                      name="transactionType"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="transactionType">
                            Tipe Transaksi
                          </FieldLabel>
                          <Combobox
                            data={INVENTORY_TRANSACTION_TYPE_OPTIONS}
                            onValueChange={field.onChange}
                            name="Tipe Tipe Transaksi"
                            selectedValue={field.value}
                          />
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : (
                            <FieldDescription>Tipe Transaksi.</FieldDescription>
                          )}
                        </Field>
                      )}
                    />

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
                              autoComplete="off"
                              placeholder="Contoh: 10"
                              {...field}
                            />
                            <InputGroupAddon align="inline-end">
                              <Separator
                                orientation="vertical"
                                className="h-6"
                              />
                              {unit || "Unit"}
                            </InputGroupAddon>
                          </InputGroup>
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : (
                            <FieldDescription>Jumlah stok.</FieldDescription>
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name="notes"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="notes">Catatan Stok</FieldLabel>
                          <Input
                            id="notes"
                            autoComplete="off"
                            placeholder="Contoh: Pembelian rutin bulanan"
                            {...field}
                          />
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : (
                            <FieldDescription>
                              Tambahkan catatan jika diperlukan.
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
                        <Field>
                          <FieldLabel htmlFor="image">
                            Foto Bukti Stok
                          </FieldLabel>
                          <div
                            className="border-2 border-dashed rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                            onClick={() => fileInputRef.current?.click()}
                          >
                            {imagePreview ? (
                              <img
                                src={imagePreview}
                                alt="Preview"
                                className="max-h-36 rounded object-contain"
                              />
                            ) : (
                              <>
                                <LuUpload
                                  size={24}
                                  className="text-muted-foreground"
                                />
                                <span className="text-sm text-muted-foreground">
                                  Klik untuk upload gambar
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
                          {fieldState.invalid ? (
                            <FieldError errors={[fieldState.error]} />
                          ) : (
                            <FieldDescription>
                              Upload foto bukti stok (JPG/PNG).
                            </FieldDescription>
                          )}
                        </Field>
                      )}
                    />
                  </div>
                  <div className="">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="flex-1 h-px bg-border" />
                      <div
                        className={cn(
                          "flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold",
                          isNonGrant
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                            : "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                        )}
                      >
                        <MdOutlineReceipt size={14} />
                        {isNonGrant
                          ? "Data Transaksi Non-Grant"
                          : "Data Harga (Grant)"}
                      </div>
                      <div className="flex-1 h-px bg-border" />
                    </div>
                    <div
                      className={cn(
                        "rounded-sm border p-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 transition-colors",
                        isNonGrant
                          ? "bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
                          : "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800",
                      )}
                    >
                      <Controller
                        name="transactionDate"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <DateTimePicker24h
                            value={field.value}
                            onValueChange={field.onChange}
                            label="Tanggal Transaksi"
                            placeholder="Pilih tanggal transaksi"
                            description="Tanggal laporan transaksi."
                            error={
                              fieldState.invalid ? fieldState.error : undefined
                            }
                          />
                        )}
                      />

                      <Controller
                        name="pricePerItem"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel htmlFor="pricePerItem">
                              Harga Per Item/{unit}{" "}
                              {isNonGrant ? "" : "(Perkiraan)"}
                            </FieldLabel>
                            <InputGroup>
                              <InputGroupAddon align="inline-start">
                                Rp
                                <Separator
                                  orientation="vertical"
                                  className="h-6"
                                />
                              </InputGroupAddon>
                              <InputGroupInput
                                id="pricePerItem"
                                type="text"
                                placeholder="Contoh: 50.000"
                                {...field}
                                onChange={(e) => {
                                  const val = e.target.value.replace(/\D/g, "");
                                  field.onChange(val ? Number(val) : "");
                                }}
                                value={
                                  field.value
                                    ? formatNumber(
                                        field.value as number | string,
                                      )
                                    : ""
                                }
                              />
                            </InputGroup>
                            {fieldState.invalid ? (
                              <FieldError errors={[fieldState.error]} />
                            ) : (
                              <FieldDescription>
                                Harga per item.
                              </FieldDescription>
                            )}
                          </Field>
                        )}
                      />

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
                                  className="h-6"
                                />
                              </InputGroupAddon>
                              <InputGroupInput
                                id="totalPrice"
                                // type="number"
                                // min={0}
                                // step={1}
                                placeholder="Dihitung otomatis"
                                {...field}
                                disabled
                                value={
                                  field.value
                                    ? formatNumber(
                                        field.value as number | string,
                                      )
                                    : ""
                                }
                              />
                            </InputGroup>
                            {fieldState.invalid ? (
                              <FieldError errors={[fieldState.error]} />
                            ) : (
                              <FieldDescription>
                                Harga × Jumlah (otomatis).
                              </FieldDescription>
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="notesTransaction"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel htmlFor="notesTransaction">
                              Catatan Transaksi
                            </FieldLabel>
                            <Input
                              id="notesTransaction"
                              autoComplete="off"
                              placeholder={
                                isNonGrant
                                  ? "Contoh: Dibeli dari toko ABC, No. faktur 123"
                                  : "Contoh: Bantuan dari pemerintah"
                              }
                              {...field}
                              className="bg-white"
                            />
                            {fieldState.invalid ? (
                              <FieldError errors={[fieldState.error]} />
                            ) : (
                              <FieldDescription>
                                {isNonGrant
                                  ? "Catatan detail transaksi pembelian."
                                  : "Catatan detail penerimaan bantuan."}
                              </FieldDescription>
                            )}
                          </Field>
                        )}
                      />

                      <Controller
                        name="imageTransaction"
                        control={form.control}
                        render={({
                          field: { onChange, value, ref: _ref, ...rest },
                          fieldState,
                        }) => (
                          <Field>
                            <FieldLabel htmlFor="imageTransaction">
                              {isNonGrant
                                ? "Foto Bukti Transaksi / Nota"
                                : "Foto Bukti Serah Terima"}
                            </FieldLabel>
                            <div
                              className="border-2 bg-white border-dashed rounded-md p-4 flex flex-col items-center gap-2 cursor-pointer hover:bg-muted/50 transition-colors"
                              onClick={() =>
                                fileInputRefTransaction.current?.click()
                              }
                            >
                              {imageTransactionPreview ? (
                                <img
                                  src={imageTransactionPreview}
                                  alt="Preview"
                                  className="max-h-36 rounded object-contain"
                                />
                              ) : (
                                <>
                                  <LuUpload
                                    size={24}
                                    className="text-muted-foreground"
                                  />
                                  <span className="text-sm text-muted-foreground">
                                    Klik untuk upload gambar
                                  </span>
                                </>
                              )}
                            </div>
                            <input
                              ref={fileInputRefTransaction}
                              id="imageTransaction"
                              type="file"
                              accept="image/jpeg,image/png,image/jpg"
                              className="hidden"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  onChange(file);
                                  setImageTransactionPreview(
                                    URL.createObjectURL(file),
                                  );
                                }
                              }}
                              {...rest}
                            />
                            {fieldState.invalid ? (
                              <FieldError errors={[fieldState.error]} />
                            ) : (
                              <FieldDescription>
                                {isNonGrant
                                  ? "Upload foto nota atau bukti pembelian (JPG/PNG)."
                                  : "Upload foto bukti serah terima (JPG/PNG)."}
                              </FieldDescription>
                            )}
                          </Field>
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col-reverse justify-end sm:flex-row gap-2 mt-4">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto cursor-pointer flex items-center justify-center"
                      type="button"
                      onClick={handleReset}
                    >
                      <RiResetRightLine className="mr-2" />
                      Reset
                    </Button>
                    <Button
                      type="submit"
                      className="w-full sm:w-auto cursor-pointer flex items-center justify-center"
                    >
                      <LuSave className="mr-2" />
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

export default PostStockInOut;
