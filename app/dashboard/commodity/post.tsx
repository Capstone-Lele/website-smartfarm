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
import React, { useEffect, useMemo, useState } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { FiPlusCircle } from "react-icons/fi";
import { RiResetRightLine } from "react-icons/ri";
import { LuPackage, LuPlus, LuSave, LuUpload } from "react-icons/lu";
import { toast } from "sonner";
import { z } from "zod";
import { Combobox } from "@/components/combobox";
import { Separator } from "@/components/ui/separator";
import { useGetBuyers } from "@/lib/api/service/master-data/buyer/useBuyer";
import { Buyer } from "@/types/master-data/buyer.types";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { useListHarvest } from "@/lib/api/service/notes/harvest/useHarvest";
import { formatDate } from "@/lib/utils/format-date";
import { useCreateCommodity } from "@/lib/api/service/commodity/useCommodity";
import { CommodityResponse } from "@/types/comodity";
import PopupConfirmation from "@/components/popup-confimation";

import {
  formSchema,
  FormValues,
  HarvestNoteOption,
  OrderItemRow,
} from "./order-item-row";

/* -------------------------------------------------------------------------- */
/*  Main Component                                                              */
/* -------------------------------------------------------------------------- */

const PostSellCommodity = ({
  dataCommodity,
}: {
  dataCommodity?: CommodityResponse;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogConfirmationOpen, setDialogConfirmationOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const { data: buyersData, isLoading: isLoadingBuyers } = useGetBuyers();
  const { data: harvestData, isLoading: isLoadingHarvest } = useListHarvest();
  const commodityMutation = useCreateCommodity();

  /* Build harvest note options with remaining stock */
  const harvestNoteOptions = useMemo<HarvestNoteOption[] | undefined>(() => {
    return dataCommodity?.data
      ?.filter((commodity) => commodity.type === "in")
      .map((commodity) => {
        const remaining =
          Number(commodity.quantity) - Number(commodity.soldQuantity || 0);
        return {
          value: commodity.id,
          label: `${formatDate(commodity.date)} - Komoditas Masuk ${commodity.poolName ? `| Kolam ${commodity.poolName}` : ""} - Sisa: ${remaining.toLocaleString("id-ID")} ekor`,
          amount: remaining,
        };
      });
  }, [dataCommodity]);

  /* Dynamic schema: validates total quantity across items per harvestNoteId */
  const dynamicSchema = useMemo(() => {
    return formSchema.superRefine((data, ctx) => {
      const requestedQuantities: Record<string, number> = {};

      data.items.forEach((item) => {
        const qty = Number(item.quantity) || 0;
        if (item.harvestNoteId) {
          requestedQuantities[item.harvestNoteId] =
            (requestedQuantities[item.harvestNoteId] || 0) + qty;
        }
      });

      data.items.forEach((item, index) => {
        if (!item.harvestNoteId) return;
        const harvest = harvestNoteOptions?.find(
          (h) => h.value === item.harvestNoteId,
        );
        if (harvest) {
          const totalRequested = requestedQuantities[item.harvestNoteId] || 0;
          if (totalRequested > harvest.amount) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: `Total item dengan stok ini (${totalRequested.toLocaleString("id-ID")} ekor) melebihi batas stok (${harvest.amount.toLocaleString("id-ID")} ekor)`,
              path: ["items", index, "quantity"],
            });
          }
        }
      });
    });
  }, [harvestNoteOptions]);

  const form = useForm<FormValues>({
    resolver: zodResolver(dynamicSchema) as any,
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

  /**
   * stockMap: sisa stok per harvestNoteId setelah dikurangi semua order.
   * Dihitung real-time dari watchedItems.
   */
  const stockMap = useMemo(() => {
    if (!harvestNoteOptions) return {} as Record<string, number>;
    const items = watchedItems || [];

    const totalPerNote: Record<string, number> = {};
    items.forEach((item) => {
      if (!item?.harvestNoteId) return;
      totalPerNote[item.harvestNoteId] =
        (totalPerNote[item.harvestNoteId] || 0) + (Number(item.quantity) || 0);
    });

    const map: Record<string, number> = {};
    harvestNoteOptions.forEach((h) => {
      const used = totalPerNote[h.value] || 0;
      map[h.value] = h.amount - used;
    });
    return map;
  }, [watchedItems, harvestNoteOptions]);

  /**
   * Real-time stock validation via setError/clearErrors.
   * Karena zodResolver hanya di-init sekali, validasi stok dijalankan
   * secara manual setiap kali items berubah.
   */
  useEffect(() => {
    if (!harvestNoteOptions) return;

    const items = watchedItems || [];
    const totalPerNote: Record<string, number> = {};

    items.forEach((item) => {
      if (!item?.harvestNoteId) return;
      totalPerNote[item.harvestNoteId] =
        (totalPerNote[item.harvestNoteId] || 0) + (Number(item.quantity) || 0);
    });

    items.forEach((item, idx) => {
      if (!item?.harvestNoteId) return;
      const harvest = harvestNoteOptions.find(
        (h) => h.value === item.harvestNoteId,
      );
      if (!harvest) return;

      const total = totalPerNote[item.harvestNoteId] || 0;
      if (total > harvest.amount) {
        form.setError(`items.${idx}.quantity`, {
          type: "manual",
          message: `Total order untuk stok ini (${total.toLocaleString("id-ID")} ekor) melebihi stok tersedia (${harvest.amount.toLocaleString("id-ID")} ekor)`,
        });
      } else {
        const currentErr = form.formState.errors?.items?.[idx]?.quantity;
        if (currentErr?.type === "manual") {
          form.clearErrors(`items.${idx}.quantity`);
        }
      }
    });
  }, [watchedItems, harvestNoteOptions, form]);

  const buyerOptions =
    buyersData?.data
      ?.filter((buyer: Buyer) => !buyer.deletedAt)
      .map((buyer: Buyer) => ({
        label: `${buyer.name} (${buyer.type})`,
        value: buyer.id,
      })) || [];

  const onSubmit = async (data: FormValues) => {
    if (!dialogConfirmationOpen && !isSubmitting) {
      setDialogConfirmationOpen(true);
      return;
    }

    try {
      setIsSubmitting(true);
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
    } finally {
      setIsSubmitting(false);
      setDialogConfirmationOpen(false);
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

  const isPending = form.formState.isSubmitting || isSubmitting;

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
    <>
      <PopupConfirmation
        title="Konfirmasi Penjualan Komoditas"
        message="Apakah Anda yakin ingin menyimpan penjualan ini? Pastikan semua informasi dan jumlah item komoditas sudah benar."
        type="warning"
        onConfirm={() => {
          setIsSubmitting(true);
          form.handleSubmit(onSubmit)();
        }}
        onCancel={() => {
          toast("Penjualan dibatalkan");
        }}
        isLoading={isSubmitting}
        isOpen={dialogConfirmationOpen}
        setOpen={setDialogConfirmationOpen}
      />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger className="cursor-pointer inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
          <FiPlusCircle />
          Jual Hasil Panen
        </SheetTrigger>

        <SheetContent className="w-full sm:max-w-4xl p-0">
          <div className="flex flex-col h-full">
            <SheetHeader className="border-b p-6 pb-4">
              <SheetTitle className="flex items-center gap-2">
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
                          {/* Buyer */}
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

                          {/* Order Date */}
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

                          {/* Grand Total (read-only) */}
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
                              Dihitung otomatis dari total seluruh item di
                              sebelah kanan.
                            </FieldDescription>
                          </Field>

                          {/* Notes */}
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

                          {/* Image Upload */}
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
                                      setImagePreview(
                                        URL.createObjectURL(file),
                                      );
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
                          harvestNotes={harvestNoteOptions}
                          stockMap={stockMap}
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
    </>
  );
};

export default PostSellCommodity;
