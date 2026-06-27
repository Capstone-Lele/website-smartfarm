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
import { DateTimePicker24h } from "@/components/date-picker/date-time-picker";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ButtonEditColumn from "@/components/button-column/button-edit-column";
import { InventorySubmission } from "@/types/inventory";
import { LuPackage, LuUser, LuClipboardList, LuHash } from "react-icons/lu";
import { useUpdateInventorySubmission } from "@/lib/api/service/inventory-submission/useInventorySubmission";
import PopupConfirmation from "@/components/popup-confimation";
import { formatNumber } from "@/lib/utils/format-number";

// ─── Zod Schema ──────────────────────────────────────────────────────────────

const formSchema = z
  .object({
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
    pricePerItem: z.any().optional(),
    totalPrice: z.any().optional(),
    transactionNotes: z.any().optional(),
    image: z.any().optional(),
    feedback: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.status === "pending") {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Status tidak boleh tetap 'Menunggu'. Pilih Disetujui atau Ditolak.",
        path: ["status"],
      });
    }
    if (data.status === "rejected") {
      if (!data.feedback || data.feedback.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Alasan penolakan wajib diisi",
          path: ["feedback"],
        });
      }
    }
    if (data.status === "approved") {
      const price = Number(data.pricePerItem);
      if (!price || price <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Harga harus berupa angka positif",
          path: ["pricePerItem"],
        });
      }
      const total = Number(data.totalPrice);
      if (!total || total <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Total harga harus berupa angka positif",
          path: ["totalPrice"],
        });
      }
      if (!data.transactionNotes || String(data.transactionNotes).length < 2) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Catatan transaksi wajib diisi",
          path: ["transactionNotes"],
        });
      }
      if (
        !data.image ||
        (!(data.image instanceof File) && typeof window !== "undefined")
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Foto wajib diupload",
          path: ["image"],
        });
      } else if (data.image) {
        const type = data.image.type;
        if (type && !["image/jpeg", "image/png", "image/jpg"].includes(type)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Format file harus JPG atau PNG",
            path: ["image"],
          });
        }
        if (data.image.size && data.image.size > 5 * 1024 * 1024) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Ukuran file maksimal 5MB",
            path: ["image"],
          });
        }
      }
    }
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
  const [dialogConfirmationOpen, setDialogConfirmationOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
    if (!dialogConfirmationOpen && !isSubmitting) {
      setDialogConfirmationOpen(true);
      return;
    }

    const rejectPayload = {
      status: data.status,
      feedback: data.feedback,
    };

    try {
      setIsSubmitting(true);
      console.log("Submit data:", data);
      if (data.status === "approved") {
        await updateInventorySubmission({ id: submission.id, data });
      } else {
        await updateInventorySubmission({
          id: submission.id,
          data: rejectPayload as any,
        });
      }

      toast.success("Pengajuan berhasil diperbarui");
      setIsOpen(false);
    } catch (error: any) {
      console.error("Error submitting form:", error);
      toast.error("Gagal memperbarui pengajuan", {
        description: error?.message || "Silakan coba lagi.",
      });
    } finally {
      setIsSubmitting(false);
      setDialogConfirmationOpen(false);
    }
  };

  return (
    <>
      <PopupConfirmation
        title="Konfirmasi Perubahan Status"
        message="Apakah Anda yakin ingin menyimpan perubahan status pada pengajuan ini? Pastikan semua informasi sudah benar."
        type="warning"
        onConfirm={() => {
          setIsSubmitting(true);
          form.handleSubmit(onSubmit)();
        }}
        onCancel={() => {
          toast("Perubahan dibatalkan");
        }}
        isLoading={isSubmitting}
        isOpen={dialogConfirmationOpen}
        setOpen={setDialogConfirmationOpen}
      />
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
                  <dt className="text-xs text-muted-foreground">
                    Diajukan oleh
                  </dt>
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

                  {/* Conditional: Feedback Section */}
                  {(status === "rejected" || status === "approved") && (
                    <Controller
                      name="feedback"
                      control={form.control}
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor="feedback">
                            {status === "rejected" ? (
                              <>
                                Catatan / Alasan Penolakan{" "}
                                <span className="text-destructive">*</span>
                              </>
                            ) : (
                              "Catatan Tambahan / Feedback"
                            )}
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
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 mb-4">
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
                          "rounded-sm border p-4 grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 transition-colors",
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
                            <DateTimePicker24h
                              value={field.value}
                              onValueChange={field.onChange}
                              label="Tanggal Transaksi"
                              placeholder="Pilih tanggal transaksi"
                              description="Tanggal laporan transaksi."
                              error={
                                fieldState.invalid
                                  ? fieldState.error
                                  : undefined
                              }
                            />
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
                                  type="text"
                                  placeholder="Contoh: 50.000"
                                  {...field}
                                  onChange={(e) => {
                                    const val = e.target.value.replace(
                                      /\D/g,
                                      "",
                                    );
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
                                  type="text"
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
                      disabled={status === "pending"}
                      title={
                        status === "pending"
                          ? "Ubah status terlebih dahulu sebelum menyimpan"
                          : undefined
                      }
                      className="w-full sm:w-auto cursor-pointer flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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

export default EditSubmissionModal;
