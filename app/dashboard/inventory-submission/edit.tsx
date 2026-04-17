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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LuSave, LuUpload } from "react-icons/lu";
import { RiResetRightLine } from "react-icons/ri";
import { Separator } from "@/components/ui/separator";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { toast } from "sonner";
import { Combobox } from "@/components/combobox";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  INVENTORY_SUBMISSION_STATUS,
  INVENTORY_TRANSACTION_TYPE_OPTIONS,
} from "@/lib/constants/type-inventory";
import { cn } from "@/lib/utils";
import { MdOutlineReceipt } from "react-icons/md";
import { format } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ButtonEditColumn from "@/components/button-column/button-edit-column";
import { InventorySubmission } from "@/types/inventory";
import { LuPackage, LuUser, LuClipboardList, LuHash } from "react-icons/lu";
import { useUpdateInventorySubmission } from "@/lib/api/service/inventory-submission/useInventorySubmission";

// ─── Zod Schema ──────────────────────────────────────────────────────────────

const formSchema = z.object({
  status: z.enum(["pending", "approved", "rejected"], {
    message: "Status wajib dipilih",
  }),
  // Fields below only required when status = approved
  transactionType: z
    .enum(["grant", "non-grant"], {
      message: "Tipe transaksi harus dipilih",
    })
    .optional(),
  transactionDate: z
    .date({ message: "Tanggal transaksi wajib diisi" })
    .optional(),
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
  transactionNotes: z.string().optional(),
  image: z
    .any()
    .refine(
      (file) =>
        !file || ["image/jpeg", "image/png", "image/jpg"].includes(file?.type),
      { message: "Format file harus JPG atau PNG" },
    ),
  feedback: z.string().optional(),
});

// ─── Status badge helper ──────────────────────────────────────────────────────

const statusBadgeVariant = (status: string) => {
  switch (status) {
    case "approved":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
    case "rejected":
      return "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300";
    default:
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
  }
};

const statusLabel = (status: string) => {
  switch (status) {
    case "approved":
      return "Disetujui";
    case "rejected":
      return "Ditolak";
    default:
      return "Menunggu";
  }
};

// ─── Component ────────────────────────────────────────────────────────────────

const EditSubmissionModal = ({
  submission,
}: {
  submission: InventorySubmission;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [imageTransactionPreview, setImageTransactionPreview] = useState<
    string | null
  >(null);
  const fileInputRefTransaction = useRef<HTMLInputElement>(null);
  const { mutateAsync: updateInventorySubmission } =
    useUpdateInventorySubmission();

  const form = useForm({
    resolver: zodResolver(formSchema) as any,
    defaultValues: {
      status: submission.status as "pending" | "approved" | "rejected",
      transactionType: "non-grant" as const,
      transactionDate: new Date(),
      pricePerItem: "" as any,
      totalPrice: "" as any,
      transactionNotes: "",
      image: undefined,
      feedback: "",
    },
  });

  const status = useWatch({ control: form.control, name: "status" });
  const transactionType = useWatch({
    control: form.control,
    name: "transactionType",
  });
  const pricePerItem = useWatch({
    control: form.control,
    name: "pricePerItem",
  });

  const isApproved = status === "approved";
  const isNonGrant = transactionType === "non-grant";

  // Auto-calculate totalPrice = pricePerItem × submission.quantity
  useEffect(() => {
    const price = Number(pricePerItem);
    const qty = Number(submission.quantity);
    if (!isNaN(price) && !isNaN(qty) && price > 0 && qty > 0) {
      form.setValue("totalPrice", (price * qty) as any, {
        shouldValidate: true,
      });
    } else {
      form.setValue("totalPrice", "" as any);
    }
  }, [pricePerItem, submission.quantity]);

  useEffect(() => {
    return () => {
      if (imageTransactionPreview) URL.revokeObjectURL(imageTransactionPreview);
    };
  }, [imageTransactionPreview]);

  useEffect(() => {
    if (!isOpen) {
      setImageTransactionPreview(null);
    }
  }, [isOpen]);

  const handleReset = () => {
    form.reset({
      status: submission.status as "pending" | "approved" | "rejected",
      transactionType: "non-grant",
      transactionDate: new Date(),
      pricePerItem: "" as any,
      totalPrice: "" as any,
      transactionNotes: "",
      image: undefined,
      feedback: "",
    });
    setImageTransactionPreview(null);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    const rejectPayload = {
      status: data.status,
      feedback: data.feedback,
    };

    try {
      console.log("Submit data:", data);
      if (data.status === "approved") {
        await updateInventorySubmission({ id: submission.id, data });
      } else {
        await updateInventorySubmission({
          id: submission.id,
          data: rejectPayload,
        });
      }

      toast.success("Pengajuan berhasil diperbarui");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal memperbarui pengajuan", {
        description: error?.message || "Silakan coba lagi.",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger className="">
        <div className="flex items-center gap-2">
          <ButtonEditColumn />
          <span className="text-xs font-semibold text-yellow-600">
            Perlu tindakan
          </span>
        </div>
      </SheetTrigger>
      <SheetContent
        className="sm:max-w-xl h-screen overflow-auto"
        onOpenAutoFocus={(e) => e.preventDefault()}
      >
        <SheetHeader className="border-b">
          <SheetTitle>Edit Pengajuan</SheetTitle>
          <SheetDescription>
            Tinjau detail pengajuan dan perbarui statusnya.
          </SheetDescription>
        </SheetHeader>

        <div className="px-4 pb-4 space-y-6">
          {/* ── Detail Barang yang Diajukan ── */}
          <div className="rounded-xs border bg-muted/30 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Detail Pengajuan</h3>
              <span
                className={cn(
                  "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize",
                  statusBadgeVariant(submission.status),
                )}
              >
                {submission.status}
              </span>
            </div>
            <Separator />
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm mt-4">
              <div>
                <dt className="text-xs text-muted-foreground">Produk</dt>
                <dd className="font-medium">{submission.product}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Kategori</dt>
                <dd className="font-medium">{submission.category}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Jumlah</dt>
                <dd className="font-medium">
                  {submission.quantity}{" "}
                  <span className="text-muted-foreground">
                    {submission.unit}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">Diajukan oleh</dt>
                <dd className="font-medium">{submission.user}</dd>
              </div>
              {submission.notes && (
                <div className="col-span-2">
                  <dt className="text-xs text-muted-foreground">Catatan</dt>
                  <dd className="font-medium">{submission.notes}</dd>
                </div>
              )}
              <div className="col-span-2">
                <dt className="text-xs text-muted-foreground">
                  Tanggal Pengajuan
                </dt>
                <dd className="font-medium">
                  {format(
                    new Date(submission.createdAt),
                    "dd MMMM yyyy, HH:mm",
                    {
                      locale: localeId,
                    },
                  )}
                </dd>
              </div>
            </dl>
          </div>

          {/* ── Form ── */}
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet>
              <FieldGroup>
                {/* Status */}
                <Controller
                  name="status"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field>
                      <FieldLabel htmlFor="status">
                        Ubah Status Pengajuan
                      </FieldLabel>
                      <Combobox
                        data={INVENTORY_SUBMISSION_STATUS}
                        onValueChange={field.onChange}
                        name="Status"
                        selectedValue={field.value}
                      />
                      {fieldState.invalid ? (
                        <FieldError errors={[fieldState.error]} />
                      ) : (
                        <FieldDescription>
                          Pilih status untuk pengajuan ini.
                        </FieldDescription>
                      )}
                    </Field>
                  )}
                />

                {/* ── Conditional: Feedback Section ── */}
                {(status === "rejected" || status === "approved") && (
                  <Controller
                    name="feedback"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field>
                        <FieldLabel htmlFor="feedback">
                          {status === "rejected"
                            ? "Catatan / Alasan Penolakan"
                            : "Catatan Tambahan / Feedback"}
                        </FieldLabel>
                        <Input
                          id="feedback"
                          autoComplete="off"
                          placeholder={
                            status === "rejected"
                              ? "Masukkan alasan penolakan"
                              : "Masukkan catatan tambahan (opsional)"
                          }
                          {...field}
                          className="bg-white"
                        />
                        {fieldState.invalid ? (
                          <FieldError errors={[fieldState.error]} />
                        ) : (
                          <FieldDescription>
                            {status === "rejected"
                              ? "Berikan alasan penolakan pengajuan ini."
                              : "Berikan catatan atau feedback untuk pengajuan ini."}
                          </FieldDescription>
                        )}
                      </Field>
                    )}
                  />
                )}

                {/* ── Conditional: Approved → Transaction Section ── */}
                {isApproved && (
                  <div>
                    {/* Transaction type selector */}
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 mb-4">
                      <Controller
                        name="transactionType"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field className="col-span-2">
                            <FieldLabel htmlFor="transactionType">
                              Tipe Transaksi
                            </FieldLabel>
                            <Combobox
                              data={INVENTORY_TRANSACTION_TYPE_OPTIONS}
                              onValueChange={field.onChange}
                              name="Tipe Tipe Transaksi"
                              selectedValue={field.value ?? "non-grant"}
                            />
                            {fieldState.invalid ? (
                              <FieldError errors={[fieldState.error]} />
                            ) : (
                              <FieldDescription>
                                Tipe Transaksi transaksi.
                              </FieldDescription>
                            )}
                          </Field>
                        )}
                      />
                    </div>

                    {/* Divider label */}
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

                    {/* Transaction fields */}
                    <div
                      className={cn(
                        "rounded-sm border p-4 grid grid-cols-2 gap-x-4 gap-y-2 transition-colors",
                        isNonGrant
                          ? "bg-amber-50/50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800"
                          : "bg-emerald-50/50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800",
                      )}
                    >
                      {/* Tanggal Transaksi */}
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
                                    <span>Pilih tanggal transaksi</span>
                                  )}
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
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
                                Tanggal laporan transaksi.
                              </FieldDescription>
                            )}
                          </Field>
                        )}
                      />

                      {/* Harga Per Item */}
                      <Controller
                        name="pricePerItem"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel htmlFor="pricePerItem">
                              Harga Per Item{" "}
                              {!isNonGrant && (
                                <span className="text-muted-foreground font-normal">
                                  (Perkiraan)
                                </span>
                              )}
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
                                type="number"
                                min={0}
                                step={1}
                                placeholder="Contoh: 50000"
                                {...field}
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

                      {/* Total Harga (auto) */}
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
                                type="number"
                                min={0}
                                step={1}
                                placeholder="Dihitung otomatis"
                                {...field}
                                disabled
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

                      {/* Non-grant extras */}
                      <Controller
                        name="transactionNotes"
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field>
                            <FieldLabel htmlFor="transactionNotes">
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
                        name="image"
                        control={form.control}
                        render={({
                          field: { onChange, value, ref: _ref, ...rest },
                          fieldState,
                        }) => (
                          <Field>
                            <FieldLabel htmlFor="image">
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
                                  : "Upload foto bukti serah terima hibah (JPG/PNG)."}
                              </FieldDescription>
                            )}
                          </Field>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Actions */}
                <Field orientation="vertical" className="col-span-2 mt-4">
                  <Button
                    type="submit"
                    className="cursor-pointer mr-1 flex items-center"
                  >
                    <LuSave />
                    Simpan
                  </Button>
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

export default EditSubmissionModal;
