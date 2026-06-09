"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Combobox } from "@/components/combobox";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Controller, useWatch } from "react-hook-form";
import { RiDeleteBinLine } from "react-icons/ri";
import { z } from "zod";
import { formatNumber } from "@/lib/utils/format-number";

/* -------------------------------------------------------------------------- */
/*  Zod Schema & Types                                                          */
/* -------------------------------------------------------------------------- */

export const formSchema = z.object({
  /* main transaction fields */
  buyer: z.string().min(1, "Buyer wajib dipilih"),
  orderDate: z.date({ error: "Tanggal order wajib diisi" }),
  totalPrice: z.number(),
  notes: z.string().min(1, "Keterangan minimal 1 karakter"),
  image: z
    .any()
    .refine((file) => file, { message: "Nota penjualan wajib diunggah" })
    .refine(
      (file) =>
        file && ["image/jpeg", "image/png", "image/jpg"].includes(file?.type),
      { message: "Format file harus JPG atau PNG" },
    )
    .refine((file) => !file || file.size <= 5 * 1024 * 1024, {
      message: "Ukuran file maksimal 5MB",
    }),

  /* order items */
  items: z
    .array(
      z.object({
        harvestNoteId: z.string().min(1, "Komoditas wajib dipilih"),
        quantity: z.coerce.number().min(1, "Jumlah minimal 1"),
        quantityKg: z.coerce.number().min(0.01, "Berat (kg) minimal 0.01"),
        priceKg: z.coerce
          .number({
            error: "Harga per kg wajib diisi dan harus berupa angka",
          })
          .positive({ message: "Harga harus berupa angka positif" }),
        subTotal: z.number(),
        notes: z.string().min(1, "Keterangan minimal 1 karakter"),
      }),
    )
    .min(1, "Minimal 1 item wajib diisi"),
});

export type FormValues = z.infer<typeof formSchema>;

export type HarvestNoteOption = {
  value: string;
  label: string;
  amount: number;
};

/* -------------------------------------------------------------------------- */
/*  Sub-component: Order Item Row (Accordion mode)                              */
/* -------------------------------------------------------------------------- */

interface OrderItemRowProps {
  index: number;
  control: any;
  form: any;
  onRemove: () => void;
  canRemove: boolean;
  harvestNotes?: HarvestNoteOption[];
  /** harvestNoteId → sisa stok setelah dikurangi oleh item-item lain */
  stockMap?: Record<string, number>;
}

export function OrderItemRow({
  index,
  control,
  form,
  onRemove,
  canRemove,
  harvestNotes,
  stockMap,
}: OrderItemRowProps) {
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
                <FieldLabel>Pilih Stok Komoditas (Laporan Panen)</FieldLabel>
                <Combobox
                  data={harvestNotes || []}
                  onValueChange={field.onChange}
                  name="Stok Komoditas"
                  selectedValue={field.value}
                />
                {fieldState.invalid ? (
                  <FieldError errors={[fieldState.error]} />
                ) : (
                  <FieldDescription>
                    Pilih stok komoditas yang tersedia.
                  </FieldDescription>
                )}
              </Field>
            )}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Quantity (ekor) */}
            <Controller
              name={`items.${index}.quantity`}
              control={control}
              render={({ field, fieldState }) => {
                const selectedHarvestId = form.getValues(
                  `items.${index}.harvestNoteId`,
                );
                const originalStock =
                  harvestNotes?.find((h) => h.value === selectedHarvestId)
                    ?.amount ?? null;
                const remainingForThisRow =
                  selectedHarvestId && stockMap
                    ? (stockMap[selectedHarvestId] ?? 0)
                    : null;

                return (
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
                    {fieldState.invalid ? (
                      <FieldError errors={[fieldState.error]} />
                    ) : remainingForThisRow !== null ? (
                      <FieldDescription
                        className={
                          remainingForThisRow <= 0 ? "text-destructive" : ""
                        }
                      >
                        Sisa tersedia untuk item ini:{" "}
                        <strong>
                          {remainingForThisRow.toLocaleString("id-ID")} ekor
                        </strong>
                        {originalStock !== null && (
                          <>
                            {" "}
                            (stok awal: {originalStock.toLocaleString(
                              "id-ID",
                            )}{" "}
                            ekor)
                          </>
                        )}
                      </FieldDescription>
                    ) : null}
                  </Field>
                );
              }}
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
                    autoComplete="off"
                    type="text"
                    placeholder="Contoh: 50.000"
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
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Catatan</FieldLabel>
                <Textarea
                  placeholder="Keterangan..."
                  className="min-h-16"
                  {...field}
                />
                 {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </div>
      )}
    </div>
  );
}
