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
import { useMemo, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { FiPlusCircle } from "react-icons/fi";
import { RiDeleteBinLine, RiResetRightLine } from "react-icons/ri";
import { LuPackage, LuPlus, LuSave } from "react-icons/lu";
import { toast } from "sonner";
import { z } from "zod";
import { Combobox } from "@/components/combobox";
import { Separator } from "@/components/ui/separator";
import { useGetBuyers } from "@/lib/api/service/master-data/buyer/useBuyer";
import { Buyer } from "@/types/master-data/buyer.types";
import { LuUpload } from "react-icons/lu";
import React, { useEffect } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { useListHarvest } from "@/lib/api/service/notes/harvest/useHarvest";
import { formatDate } from "@/lib/utils/format-date";
import { useCreateCommodity } from "@/lib/api/service/commodity/useCommodity";

/* -------------------------------------------------------------------------- */
/*  Zod Schema                                                                  */
/* -------------------------------------------------------------------------- */

const formSchema = z.object({
  /* main transaction fields */
  buyer: z.string().min(1, "Buyer wajib dipilih"),
  orderDate: z.date({ error: "Tanggal order wajib diisi" }),
  totalPrice: z.number(),
  notes: z.string().optional(),
  image: z
    .any()
    .refine((file) => file, { message: "Nota penjualan wajib diunggah" })
    .refine(
      (file) =>
        file && ["image/jpeg", "image/png", "image/jpg"].includes(file?.type),
      { message: "Format file harus JPG atau PNG" },
    ),

  /* order items */
  items: z
    .array(
      z.object({
        harvestNoteId: z.string().min(1, "Komoditas wajib dipilih"),
        quantity: z.coerce.number().min(1, "Jumlah minimal 1"),
        quantityKg: z.coerce.number().min(0.01, "Berat (kg) minimal 0.01"),
        priceKg: z.coerce.number().min(1, "Harga per kg minimal Rp 1"),
        subTotal: z.number(),
        notes: z.string().optional(),
      }),
    )
    .min(1, "Minimal 1 item wajib diisi"),
});

type FormValues = z.infer<typeof formSchema>;

/* -------------------------------------------------------------------------- */
/*  Sub-component: Order Item Row (Accordion mode)                              */
/* -------------------------------------------------------------------------- */

function OrderItemRow({
  index,
  control,
  form,
  onRemove,
  canRemove,
  harvestNotes,
}: {
  index: number;
  control: any;
  form: any;
  onRemove: () => void;
  canRemove: boolean;
  harvestNotes?: { value: string; label: string }[];
}) {
  const [isOpen, setIsOpen] = useState(index === 0);

  /* watch qty_kg & price_per_kg for this row to auto-compute row total */
  const MathQuantityKg = useWatch({
    control,
    name: `items.${index}.quantityKg`,
  });
  const MathPricePerKg = useWatch({
    control,
    name: `items.${index}.priceKg`,
  });
  const OptionalNoteId = useWatch({
    control,
    name: `items.${index}.harvestNoteId`,
  });

  const rowTotal =
    (Number(MathQuantityKg) || 0) * (Number(MathPricePerKg) || 0);

  /* keep hidden subTotal in form values updated */
  useEffect(() => {
    const currentRowTotal = form.getValues(`items.${index}.subTotal`);
    if (currentRowTotal !== rowTotal) {
      form.setValue(`items.${index}.subTotal`, rowTotal, {
        shouldValidate: false,
      });
    }
  }, [rowTotal, form, index]);

  return (
    <div className="rounded-lg border bg-muted/10 overflow-hidden relative">
      {/* Row header / Accordion trigger */}
      <div
        className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-muted/20 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronUp size={18} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={18} className="text-muted-foreground" />
          )}
          <span className="text-sm font-semibold text-foreground">
            Item #{index + 1}
          </span>
          {!isOpen && (
            <span className="text-xs font-medium text-muted-foreground ml-2">
              {OptionalNoteId
                ? DUMMY_COMMODITY_NOTES.find((c) => c.value === OptionalNoteId)
                    ?.label || "Item Terisi"
                : "Belum diisi"}{" "}
              — {formatRupiah(rowTotal)}
            </span>
          )}
        </div>
        {canRemove && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 w-7 p-0 cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <RiDeleteBinLine size={15} />
          </Button>
        )}
      </div>

      {isOpen && (
        <div className="p-4 pt-0 space-y-3">
          <Separator className="mb-3" />

          {/* Commodity Note */}
          <Controller
            name={`items.${index}.harvestNoteId`}
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Ambil Dari Hasil Panen</FieldLabel>
                <Combobox
                  data={harvestNotes || []}
                  onValueChange={field.onChange}
                  name="Catatan Panen"
                  selectedValue={field.value}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : (
                  <FieldDescription>Pilih catatan panen.</FieldDescription>
                )}
              </Field>
            )}
          />

          <div className="grid grid-cols-2 gap-3">
            {/* Quantity (ekor) */}
            <Controller
              name={`items.${index}.quantity`}
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Jumlah (ekor)</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      type="number"
                      placeholder="500"
                      autoComplete="off"
                      {...field}
                    />
                    <InputGroupAddon align="inline-end">
                      <Separator orientation="vertical" className="h-6" />
                      <span className="text-sm text-muted-foreground px-1">
                        ekor
                      </span>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Quantity KG */}
            <Controller
              name={`items.${index}.quantityKg`}
              control={control}
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Berat Total</FieldLabel>
                  <InputGroup>
                    <InputGroupInput
                      type="number"
                      step="0.01"
                      placeholder="25.5"
                      autoComplete="off"
                      {...field}
                    />
                    <InputGroupAddon align="inline-end">
                      <Separator orientation="vertical" className="h-6" />
                      <span className="text-sm text-muted-foreground px-1">
                        kg
                      </span>
                    </InputGroupAddon>
                  </InputGroup>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          {/* Price per KG */}
          <Controller
            name={`items.${index}.priceKg`}
            control={control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Harga per Kg</FieldLabel>
                <InputGroup>
                  <InputGroupAddon align="inline-start">
                    <span className="text-sm text-muted-foreground">Rp</span>
                    <Separator orientation="vertical" className="h-6" />
                  </InputGroupAddon>
                  <InputGroupInput
                    type="number"
                    placeholder="20000"
                    autoComplete="off"
                    {...field}
                  />
                </InputGroup>
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          {/* Row subtotal (read-only) */}
          <Field>
            <FieldLabel>Subtotal</FieldLabel>
            <Input
              value={formatRupiah(rowTotal)}
              readOnly
              disabled
              className="bg-muted font-medium"
            />
          </Field>

          {/* Notes */}
          <Controller
            name={`items.${index}.notes`}
            control={control}
            render={({ field }) => (
              <Field>
                <FieldLabel>
                  Catatan{" "}
                  <span className="text-muted-foreground text-xs">
                    (opsional)
                  </span>
                </FieldLabel>
                <Textarea
                  placeholder="Keterangan..."
                  className="min-h-16"
                  {...field}
                />
              </Field>
            )}
          />
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                              */
/* -------------------------------------------------------------------------- */

const PostSellCommodity = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: buyersData, isLoading: isLoadingBuyers } = useGetBuyers();
  const { data: harvestData, isLoading: isLoadingHarvest } = useListHarvest();
  const commodityMutation = useCreateCommodity();

  const memoizedValue = useMemo(() => {
    return harvestData?.data?.map((harvest) => ({
      value: harvest.id,
      label: `${formatDate(harvest.date)} - Panen ${harvest.poolName} | Siklus (${formatDate(harvest.cycle)} )`,
    }));
  }, [harvestData]);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      buyer: "",
      orderDate: undefined,
      totalPrice: 0,
      notes: "",
      image: undefined as any,
      items: [
        {
          harvestNoteId: "",
          quantity: "" as unknown as number,
          quantityKg: "" as unknown as number,
          priceKg: "" as unknown as number,
          subTotal: 0,
          notes: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  /* Watch all items to compute grand total */
  const watchedItems = useWatch({ control: form.control, name: "items" });
  const grandTotal = (watchedItems || []).reduce((sum, item) => {
    const kg = Number(item?.quantityKg) || 0;
    const price = Number(item?.priceKg) || 0;
    return sum + kg * price;
  }, 0);

  /* Sync grand total to form value */
  useEffect(() => {
    const currentGrandTotal = form.getValues("totalPrice");
    if (currentGrandTotal !== grandTotal) {
      form.setValue("totalPrice", grandTotal, { shouldValidate: false });
    }
  }, [grandTotal, form]);

  const buyerOptions =
    buyersData?.data?.map((buyer: Buyer) => ({
      label: `${buyer.name} (${buyer.type})`,
      value: buyer.id,
    })) || [];

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("buyer", data.buyer);

      formData.append("orderDate", data.orderDate.toISOString());
      formData.append("totalPrice", data.totalPrice.toString());

      if (data.notes) {
        formData.append("notes", data.notes);
      }

      if (data.image) {
        formData.append("image", data.image);
      }

      // Berdasarkan API Dog, items dikirim sebagai string JSON. append setiap item sebagai object JSON yang di-stringify
      data.items.forEach((item) => {
        formData.append("items", JSON.stringify(item));
      });

      console.log("Submit formData:", Array.from(formData.entries()));
      await commodityMutation.mutateAsync(formData as any);
      toast.success("Penjualan komoditas berhasil disimpan!");
      form.reset();
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal menyimpan penjualan", {
        description: error?.message || "Silakan coba lagi.",
      });
    }
  };

  const handleAddItem = () => {
    append({
      harvestNoteId: "",
      quantity: "" as unknown as number,
      quantityKg: "" as unknown as number,
      priceKg: "" as unknown as number,
      subTotal: 0,
      notes: "",
    });
  };

  const isPending = form.formState.isSubmitting;

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

  const handleReset = () => {
    form.reset();
    setImagePreview(null);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
        <FiPlusCircle />
        Jual Hasil Panen
      </SheetTrigger>

      <SheetContent className="w-full sm:max-w-4xl p-0">
        <div className="flex flex-col h-full">
          <SheetHeader className="border-b p-6 pb-4">
            <SheetTitle className="flex items-center gap-2">
              <LuPackage className="text-primary" />
              Penjualan Komoditas
            </SheetTitle>
            <SheetDescription>
              Isi form di bawah untuk mencatat transaksi penjualan ikan.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-6">
            <form
              id="commodity-post-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              {/* ── 2 COLUMN LAYOUT ─────────────────────────────────────────── */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* ── LEFT COLUMN: Main Info ─────────────────────────────────── */}
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-4">
                      Informasi Utama
                      <Separator className="flex-1" />
                    </h3>
                    <FieldSet>
                      <FieldGroup>
                        <Controller
                          name="buyer"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field>
                              <FieldLabel htmlFor="buyer">
                                Pembeli (Buyer)
                              </FieldLabel>
                              <Combobox
                                data={buyerOptions}
                                onValueChange={field.onChange}
                                name="Pembeli"
                                isLoading={isLoadingBuyers}
                                selectedValue={field.value}
                              />
                              {fieldState.invalid ? (
                                <FieldError errors={[fieldState.error]} />
                              ) : (
                                <FieldDescription>
                                  Pilih pembeli yang akan menerima komoditas.
                                </FieldDescription>
                              )}
                            </Field>
                          )}
                        />

                        <Controller
                          name="orderDate"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field>
                              <FieldLabel>Tanggal Order</FieldLabel>
                              <Popover
                                open={calendarOpen}
                                onOpenChange={setCalendarOpen}
                              >
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    type="button"
                                    className="w-full justify-between font-normal text-left"
                                  >
                                    {field.value ? (
                                      format(field.value, "dd MMMM yyyy", {
                                        locale: localeId,
                                      })
                                    ) : (
                                      <span className="text-muted-foreground">
                                        Pilih tanggal...
                                      </span>
                                    )}
                                    <CalendarIcon className="h-4 w-4 text-muted-foreground shrink-0" />
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={(date) => {
                                      field.onChange(date);
                                      setCalendarOpen(false);
                                    }}
                                    initialFocus
                                  />
                                </PopoverContent>
                              </Popover>
                              {fieldState.invalid ? (
                                <FieldError errors={[fieldState.error]} />
                              ) : (
                                <FieldDescription>
                                  Tanggal transaksi penjualan.
                                </FieldDescription>
                              )}
                            </Field>
                          )}
                        />

                        <Field>
                          <FieldLabel>Total Harga Kasar</FieldLabel>
                          <InputGroup>
                            <InputGroupAddon align="inline-start">
                              <span className="text-sm text-muted-foreground">
                                Rp
                              </span>
                              <Separator
                                orientation="vertical"
                                className="h-6"
                              />
                            </InputGroupAddon>
                            <InputGroupInput
                              value={grandTotal.toLocaleString("id-ID")}
                              readOnly
                              disabled
                              className="bg-muted font-semibold text-primary"
                            />
                          </InputGroup>
                          <FieldDescription>
                            Dihitung otomatis dari total seluruh item di sebelah
                            kanan.
                          </FieldDescription>
                        </Field>

                        <Controller
                          name="notes"
                          control={form.control}
                          render={({ field }) => (
                            <Field>
                              <FieldLabel>Catatan Transaksi</FieldLabel>
                              <Textarea
                                placeholder="Tambahan keterangan untuk transaksi ini..."
                                className="min-h-16"
                                {...field}
                              />
                            </Field>
                          )}
                        />

                        <Controller
                          name="image"
                          control={form.control}
                          render={({
                            field: {
                              value,
                              onChange,
                              ref: _ref,
                              ...fieldProps
                            },
                            fieldState,
                          }) => (
                            <Field>
                              <FieldLabel>Upload Nota Penjualan</FieldLabel>
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
                                type="file"
                                accept="image/png, image/jpeg, image/jpg"
                                className="hidden"
                                onChange={(e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    onChange(file);
                                    setImagePreview(URL.createObjectURL(file));
                                  }
                                }}
                                {...fieldProps}
                              />
                              {fieldState.invalid ? (
                                <FieldError errors={[fieldState.error]} />
                              ) : (
                                <FieldDescription>
                                  Format JPG/PNG.
                                </FieldDescription>
                              )}
                            </Field>
                          )}
                        />
                      </FieldGroup>
                    </FieldSet>
                  </div>
                </div>

                {/* ── RIGHT COLUMN: Order Items ──────────────────────────────── */}
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                      Daftar Item Komoditas
                      <Separator className="flex-1" />
                    </h3>
                    {form.formState.errors.items?.root && (
                      <p className="text-destructive text-xs mb-2">
                        {form.formState.errors.items.root.message}
                      </p>
                    )}
                    {typeof form.formState.errors.items?.message ===
                      "string" && (
                      <p className="text-destructive text-xs mb-2">
                        {form.formState.errors.items.message}
                      </p>
                    )}
                    <span className="text-xs text-muted-foreground">
                      Klik pada item untuk membuka atau menutup form.
                    </span>
                  </div>

                  <div className="space-y-3">
                    {fields.map((field, index) => (
                      <OrderItemRow
                        key={field.id}
                        index={index}
                        control={form.control}
                        form={form}
                        onRemove={() => remove(index)}
                        canRemove={fields.length > 1}
                        harvestNotes={memoizedValue}
                      />
                    ))}
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    className="w-full cursor-pointer border-dashed"
                    onClick={handleAddItem}
                  >
                    <LuPlus className="mr-1" />
                    Tambah Item Transaksi
                  </Button>
                </div>
              </div>
            </form>
          </div>

          <div className="border-t p-6 bg-muted/20 flex items-center justify-end gap-3">
            <Button
              variant="outline"
              className="cursor-pointer"
              type="button"
              onClick={handleReset}
            >
              <RiResetRightLine className="mr-1" />
              Reset Form
            </Button>
            {isPending ? (
              <Button className="cursor-not-allowed" disabled>
                <span className="loading loading-spinner" />
                Menyimpan...
              </Button>
            ) : (
              <Button
                form="commodity-post-form"
                className="cursor-pointer"
                type="submit"
              >
                <LuSave className="mr-1" />
                Simpan Penjualan
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default PostSellCommodity;
