"use client";
import React, { useEffect, useRef, useState } from "react";
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
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { FiPlusCircle } from "react-icons/fi";
import { Input } from "@/components/ui/input";
import { LuSave, LuUpload } from "react-icons/lu";
import { RiResetRightLine } from "react-icons/ri";
import { Separator } from "@/components/ui/separator";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Spinner } from "@/components/ui/spinner";
import z from "zod";
import { toast } from "sonner";
// import { useStockInOut } from "@/lib/api/service/inventory/useInventory";
import { Combobox } from "@/components/combobox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { useParams } from "next/navigation";
import { INVENTORY_TRANSACTION_TYPE_OPTIONS, INVENTORY_TYPE_OPTIONS } from "@/lib/constants/type-inventory";

const formSchema = z.object({
  reportDate: z.string().min(1, { message: "Tanggal laporan wajib diisi" }),
  quantity: z
    .string()
    .min(1, { message: "Jumlah wajib diisi" })
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Jumlah harus berupa angka positif",
    }),
  type: z.enum(["in", "out"], { message: "Tipe harus dipilih" }),
  notes: z.string().optional(),
  transactionType: z.enum(["grant", "non-grant"], {
    message: "Tipe transaksi harus dipilih",
  }),
  image: z
    .any()
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/jpg"].includes(file?.type),
      { message: "Format file harus JPG atau PNG" },
    ),
  pricePerItem: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? undefined : val,
    z.union([
      z.coerce
        .number({ error: "Harga per item harus berupa angka" })
        .positive({ message: "Harga per item harus lebih besar dari 0" }),
      z.undefined(),
    ]),
  ),
  totalPrice: z.preprocess(
    (val) =>
      val === "" || val === null || val === undefined ? undefined : val,
    z.union([
      z.coerce
        .number({ error: "Total harga harus berupa angka" })
        .positive({ message: "Total harga harus lebih besar dari 0" }),
      z.undefined(),
    ]),
  ),
});

type FormValues = z.infer<typeof formSchema>;

const PostStockInOut = () => {
  const params = useParams();
  const inventoryId = params?.id as string;
  //   const stockMutation = useStockInOut(inventoryId);
  const [isOpen, setIsOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const form = useForm({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      reportDate: "",
      quantity: "",
      type: "in" as const,
      notes: "",
      transactionType: "non-grant" as const,
      image: undefined,
      pricePerItem: "" as any,
      totalPrice: "" as any,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const dataPrep = {
      reportDate: data.reportDate,
      quantity: data.quantity,
      type: data.type,
      transactionType: data.transactionType,
      notes: data.notes,
      pricePerItem: data.pricePerItem,
      totalPrice: data.totalPrice,
    };
    try {
      //   const formData = new FormData();
      //   formData.append("reportDate", data.reportDate);
      //   formData.append("quantity", data.quantity);
      //   formData.append("type", data.type);
      //   formData.append("transactionType", data.transactionType);
      //   if (data.notes) formData.append("notes", data.notes);
      //   if (data.image) formData.append("image", data.image);
      //   if (data.pricePerItem !== undefined)
      //     formData.append("pricePerItem", String(data.pricePerItem));
      //   if (data.totalPrice !== undefined)
      //     formData.append("totalPrice", String(data.totalPrice));

      //   await stockMutation.mutateAsync(formData);
      form.reset();
      setImagePreview(null);
      toast.success("Stok berhasil diperbarui");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal memperbarui stok", {
        description: error?.message || "Silakan coba lagi.",
      });
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
      form.setValue("totalPrice", (price * qty) as any, {
        shouldValidate: true,
      });
    } else {
      form.setValue("totalPrice", "" as any);
    }
  }, [pricePerItem, quantity]);

  const handleReset = () => {
    form.reset();
    setImagePreview(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <FiPlusCircle />
        Tambah/Kurangi Stok
      </SheetTrigger>
      <SheetContent className="sm:max-w-2xl">
        <SheetHeader className="border-b">
          <SheetTitle>Tambah/Kurangi Stok</SheetTitle>
          <SheetDescription>
            Isi form di bawah ini untuk menambahkan atau mengurangi stok.
          </SheetDescription>
        </SheetHeader>
        <div className="p-4">
          <form action="" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet>
              <FieldGroup>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                  <Controller
                    name="reportDate"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="reportDate">
                          Tanggal Laporan
                        </FieldLabel>
                        <Input
                          id="reportDate"
                          type="date"
                          autoComplete="off"
                          {...field}
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>
                            Masukkan tanggal laporan transaksi.
                          </FieldDescription>
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
                          <FieldDescription>
                            Masukkan jumlah stok.
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
                        <FieldLabel htmlFor="type">Tipe Transaksi</FieldLabel>
                        <Combobox
                          data={INVENTORY_TYPE_OPTIONS}
                          onValueChange={field.onChange}
                          name="type"
                          selectedValue={field.value}
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>
                            Pilih tipe transaksi stok.
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />

                  <Controller
                    name="transactionType"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="transactionType">
                          Sumber Dana
                        </FieldLabel>
                        <Combobox
                          data={INVENTORY_TRANSACTION_TYPE_OPTIONS}
                          onValueChange={field.onChange}
                          name="transactionType"
                          selectedValue={field.value}
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>
                            Pilih sumber dana transaksi.
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />

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
                            <Separator orientation="vertical" className="h-6" />
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
                          <FieldDescription>Harga per item.</FieldDescription>
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
                            <Separator orientation="vertical" className="h-6" />
                          </InputGroupAddon>
                          <InputGroupInput
                            id="totalPrice"
                            type="number"
                            min={0}
                            step={100}
                            placeholder="Dihitung berdasarkan Per Item"
                            {...field}
                            disabled
                          />
                        </InputGroup>
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>Total harga.</FieldDescription>
                        )}
                      </Field>
                    )}
                  />

                  <div className="col-span-2">
                    <Controller
                      name="notes"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="notes">
                            Catatan (Opsional)
                          </FieldLabel>
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
                  </div>

                  <div className="col-span-2">
                    <Controller
                      name="image"
                      control={form.control}
                      render={({
                        field: { onChange, value, ref: _ref, ...rest },
                        fieldState,
                      }) => (
                        <Field>
                          <FieldLabel htmlFor="image">
                            Foto Bukti Transaksi
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
                              Upload foto bukti transaksi (JPG/PNG).
                            </FieldDescription>
                          )}
                        </Field>
                      )}
                    />
                  </div>
                </div>

                {/* Action Buttons — full width */}
                <Field orientation="vertical" className="col-span-2">
                  {/* {stockMutation.isPending ? (
                    <Button
                      disabled
                      className="cursor-not-allowed mr-1 flex items-center"
                    >
                      <Spinner className="mr-2" />
                      Memproses...
                    </Button>
                  ) : ( */}
                  <Button
                    type="submit"
                    className="cursor-pointer mr-1 flex items-center"
                  >
                    <LuSave />
                    Simpan
                  </Button>
                  {/* )} */}
                  <Button
                    variant="outline"
                    className="cursor-pointer flex items-center"
                    type="button"
                    onClick={handleReset}
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

export default PostStockInOut;
