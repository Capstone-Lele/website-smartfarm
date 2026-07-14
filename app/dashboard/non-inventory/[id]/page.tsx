"use client";

import DefaultCard from "@/components/card/default-card";
import { ButtonCopy } from "@/components/button-copy";
import ButtonRedirectColumn from "@/components/button-column/button-redirect-column";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useFinanceBySourceId } from "@/lib/api/service/finance/useFinance";
import { useGetProductById } from "@/lib/api/service/master-data/product/useProduct";
import { useNonInventory } from "@/lib/api/service/non-inventory/useNonInventory";
import { inventoryTransactionTypeTranslation } from "@/lib/constants/type-inventory";
import { useBreadcrumbStore } from "@/lib/store/useBreadcrumbStore";
import { formatDate } from "@/lib/utils/format-date";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { FinanceBySourceId } from "@/types/finance/finance";
import { use, useEffect, useState } from "react";
import { LuArrowLeftRight, LuRepeat2 } from "react-icons/lu";
import { useQueryClient } from "@tanstack/react-query";
import { useCreateTransactionReversalNonInventoryNote } from "@/lib/api/service/transaction-reversal/useTransactionReversal";
import PopupReversal from "@/components/popup-reversal";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { TbArrowBackUpDouble } from "react-icons/tb";

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <div className="text-sm font-medium break-words mt-0.5">{value}</div>
      </div>
    </div>
  );
}

type ReversalFinanceRecord = FinanceBySourceId & {
  referenceTransactionSourceId?: string | null;
  reversedBySourceId?: string | null;
  reversalSourceId?: string | null;
  reversalSourceLabel?: string | null;
};

function ReversalTransactionCard({
  financeRecord,
}: {
  financeRecord: ReversalFinanceRecord | null;
}) {
  if (!financeRecord) return null;

  const reversalTransactionId =
    financeRecord.transactionReversalId ??
    financeRecord.reversedBySourceId ??
    null;
  const reversalNoteId =
    financeRecord.transactionReversalNoteId ??
    financeRecord.reversalSourceId ??
    null;
  const referenceTransactionId = financeRecord.referenceId ?? null;
  const referenceSourceId =
    financeRecord.referenceSourceId ??
    financeRecord.referenceTransactionSourceId ??
    null;
  const isReversed = Boolean(
    financeRecord.isReversed || reversalTransactionId || reversalNoteId,
  );
  const isReversal = Boolean(
    financeRecord.type?.toLowerCase() === "reversal" ||
      referenceTransactionId ||
      referenceSourceId,
  );

  if (!isReversed && !isReversal) return null;

  return (
    <>
      {isReversed && (
        <DefaultCard className="rounded-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LuRepeat2 className="text-blue-500" size={16} />
              <h3 className="font-semibold text-sm text-blue-700 dark:text-blue-400">
                Transaksi Ini Telah Di-Reversal
              </h3>
              <Badge
                variant="secondary"
                className="text-xs bg-blue-500/10 text-blue-600 border-none"
              >
                Reversed
              </Badge>
            </div>
            <Separator className="bg-blue-200/60" />
            <p className="text-xs text-muted-foreground">
              Catatan non inventaris ini sudah pernah dilakukan transaksi
              reversal. Berikut adalah referensi ke transaksi reversal-nya.
            </p>
            <div className="flex flex-col gap-3">
              {reversalTransactionId && (
                <div className="flex items-center justify-between gap-2 rounded-md bg-blue-500/5 px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      ID Reversal Transaksi
                    </p>
                    <ButtonCopy
                      textToCopy={reversalTransactionId}
                      truncateLength={20}
                      className="text-sm font-mono"
                    />
                  </div>
                </div>
              )}
              {reversalNoteId && (
                <div className="flex items-center justify-between gap-2 rounded-md bg-blue-500/5 px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      ID Catatan Reversal
                    </p>
                    <ButtonCopy
                      textToCopy={reversalNoteId}
                      truncateLength={20}
                      className="text-sm font-mono"
                    />
                  </div>
                  <ButtonRedirectColumn
                    href={`/dashboard/non-inventory/${reversalNoteId}`}
                  />
                </div>
              )}
            </div>
          </div>
        </DefaultCard>
      )}

      {isReversal && (
        <DefaultCard className="rounded-sm">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <LuArrowLeftRight className="text-orange-500" size={16} />
              <h3 className="font-semibold text-sm text-orange-700 dark:text-orange-400">
                Ini Adalah Transaksi Reversal
              </h3>
              <Badge
                variant="secondary"
                className="text-xs bg-orange-500/10 text-orange-600 border-none"
              >
                Referensi Asal
              </Badge>
            </div>
            <Separator className="bg-orange-200/60" />
            <p className="text-xs text-muted-foreground">
              Transaksi ini merupakan pembalikan dari transaksi sebelumnya.
              Berikut adalah referensi ke transaksi asal.
            </p>
            <div className="flex flex-col gap-3">
              {referenceTransactionId && (
                <div className="flex items-center justify-between gap-2 rounded-md bg-orange-500/5 px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      ID Referensi Transaksi
                    </p>
                    <ButtonCopy
                      textToCopy={referenceTransactionId}
                      truncateLength={20}
                      className="text-sm font-mono"
                    />
                  </div>
                </div>
              )}
              {referenceSourceId && (
                <div className="flex items-center justify-between gap-2 rounded-md bg-orange-500/5 px-3 py-2">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-muted-foreground mb-0.5">
                      ID Catatan Asal
                    </p>
                    <ButtonCopy
                      textToCopy={referenceSourceId}
                      truncateLength={20}
                      className="text-sm font-mono"
                    />
                  </div>
                  <ButtonRedirectColumn
                    href={`/dashboard/non-inventory/${referenceSourceId}`}
                  />
                </div>
              )}
            </div>
          </div>
        </DefaultCard>
      )}
    </>
  );
}

export default function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id: source } = use(params);

  const { setLabel, removeLabel } = useBreadcrumbStore();
  const {
    data: inventoryDetailDataNotes,
    isLoading: isLoadingInventoryDetailNotes,
  } = useNonInventory(source);
  const { data: productData } = useGetProductById(
    inventoryDetailDataNotes?.data?.[0]?.productId || "",
  );

  const { data: financeData, isLoading: isLoadingFinance } =
    useFinanceBySourceId(source);

  const financeRecord = financeData?.data
    ? Array.isArray(financeData.data)
      ? financeData.data[0]
      : financeData.data
    : Array.isArray(financeData)
      ? financeData[0]
      : null;

  const [isReversalOpen, setIsReversalOpen] = useState(false);
  const queryClient = useQueryClient();
  const createTransactionReversal = useCreateTransactionReversalNonInventoryNote(
    financeRecord?.id || "",
  );

  const canCreateReversal =
    financeRecord &&
    financeRecord.type !== "reversal" &&
    financeRecord.referenceId === null &&
    financeRecord.referenceSourceId === null &&
    financeRecord.transactionReversalId === null &&
    financeRecord.transactionReversalNoteId === null &&
    financeRecord.isReversed === false;

  const handleReversal = async () => {
    try {
      await createTransactionReversal.mutateAsync();
      toast.success("Transaksi reversal berhasil dilakukan");
      queryClient.invalidateQueries({
        queryKey: ["getNonInventory", source],
      });
      queryClient.invalidateQueries({
        queryKey: ["getFinanceBySourceId", source],
      });
      setIsReversalOpen(false);
    } catch {
      toast.error("Gagal melakukan transaksi reversal", {
        description: "Silakan coba lagi.",
      });
    }
  };

  /* Breadcrumb */
  useEffect(() => {
    if (productData) {
      setLabel("product", productData.data?.[0]?.name);
    }

    setLabel("inventory-notes", "Detail Catatan");
    return () => removeLabel("inventory");
  }, [productData, setLabel, removeLabel]);

  const isIncome = financeRecord?.type?.toLowerCase() === "in";
  const isReversal = financeRecord?.type?.toLowerCase() === "reversal";
  const badgeColor = isIncome
    ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
    : isReversal
      ? "bg-blue-500/10 text-blue-600 hover:bg-blue-500/20"
      : "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20";
  const mainTypeColor = isIncome
    ? "text-emerald-600"
    : isReversal
      ? "text-blue-600"
      : "text-orange-500";

  if (isLoadingInventoryDetailNotes || isLoadingFinance) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Memuat detail catatan...
      </div>
    );
  }

  if (!inventoryDetailDataNotes) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Catatan tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ReversalTransactionCard
        financeRecord={financeRecord as ReversalFinanceRecord | null}
      />

      {canCreateReversal && (
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-background p-4 rounded-sm border ">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Reversal Transaksi
            </h2>
            <p className="text-xs text-muted-foreground">
              Silahkan klik tombol reversal transaksi untuk melakukan reversal transaksi ini
            </p>
          </div>
          <div>
            <Button
              className="bg-primary hover:bg-primary/80 text-white gap-2 cursor-pointer"
              onClick={() => setIsReversalOpen(true)}
              disabled={createTransactionReversal.isPending}
            >
              <TbArrowBackUpDouble size={18} />
              Reversal Transaksi
            </Button>
            <PopupReversal
              title="Konfirmasi Reversal"
              message="Apakah Anda yakin ingin melakukan reversal transaksi ini? Aksi ini akan membuat transaksi pembalik. Jika hal ini dilakukan, tolong segera lakukan transaksi pembenaran."
              type="warning"
              isOpen={isReversalOpen}
              setOpen={setIsReversalOpen}
              isLoading={createTransactionReversal.isPending}
              onConfirm={handleReversal}
              onCancel={() => setIsReversalOpen(false)}
            />
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DefaultCard className="p-4 rounded-sm">
          <p className="text-xs text-muted-foreground mb-1">Tipe Catatan</p>
          <p className={`text-lg font-semibold capitalize ${mainTypeColor}`}>
            {isIncome ? "Masuk" : isReversal ? "Reversal" : "Keluar"}
          </p>
        </DefaultCard>

        <DefaultCard className="p-4 rounded-sm">
          <p className="text-xs text-muted-foreground mb-1">Tipe Transaksi</p>
          <p className="text-lg font-semibold text-foreground">
            {inventoryTransactionTypeTranslation(
              inventoryDetailDataNotes?.data?.[0]?.transactionType,
            )}
          </p>
        </DefaultCard>

        <DefaultCard className="p-4 rounded-sm">
          <p className="text-xs text-muted-foreground mb-1">Kuantitas</p>
          <p className="text-lg font-semibold text-foreground">
            {Number(
              inventoryDetailDataNotes?.data?.[0]?.quantity,
            ).toLocaleString("id-ID")}
          </p>
        </DefaultCard>

        <DefaultCard className="p-4 rounded-sm">
          <p className="text-xs text-muted-foreground mb-1">Total Nilai</p>
          <p className="text-lg font-semibold text-emerald-600">
            {formatRupiah(
              financeRecord?.totalPrice
                ? Number(financeRecord?.pricePerItem) *
                    Number(inventoryDetailDataNotes?.data?.[0]?.quantity)
                : 0,
            )}
          </p>
        </DefaultCard>
      </div>

      <DefaultCard className="rounded-sm">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm">Informasi Produk</h3>
          </div>
          <Separator />
          {!productData ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              Data produk tidak ditemukan.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoRow
                label="Nama Produk"
                value={productData.data?.[0]?.name}
              />
              <InfoRow
                label="Kategori Produk"
                value={productData.data?.[0]?.category}
              />
              <InfoRow
                label="Unit Satuan"
                value={productData.data?.[0]?.unit}
              />
            </div>
          )}
        </div>
      </DefaultCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DefaultCard className="rounded-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">Informasi Catatan</h3>
              <Badge
                variant="secondary"
                className={`text-xs ${badgeColor} border-none`}
              >
                {isIncome
                  ? "Penambahan"
                  : isReversal
                    ? "Reversal"
                    : "Pengurangan"}
              </Badge>
            </div>
            <Separator />
            <div className="space-y-4">
              <InfoRow label="ID Catatan" value={source} />
              <InfoRow
                label="Kuantitas"
                value={`${Number(inventoryDetailDataNotes?.data?.[0]?.quantity).toLocaleString("id-ID")}`}
              />
              <InfoRow
                label="Jenis Transaksi"
                value={inventoryTransactionTypeTranslation(
                  inventoryDetailDataNotes?.data?.[0]?.transactionType,
                )}
              />
            </div>
          </div>
        </DefaultCard>

        {/* Detail Transaksi Finansial */}
        <DefaultCard className="rounded-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">Detail Transaksi</h3>
            </div>
            <Separator />

            {!financeRecord ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Tidak ada data finansial komersial untuk catatan ini.
              </p>
            ) : (
              <div className="space-y-4">
                {financeRecord ? (
                  <>
                    <InfoRow label="ID Transaksi" value={financeRecord.id} />
                    <InfoRow
                      label="Tanggal Transaksi"
                      value={formatDate(financeRecord.transactionDate || "-")}
                    />
                    <InfoRow
                      label="Harga Per Unit"
                      value={
                        financeRecord.pricePerItem
                          ? formatRupiah(Number(financeRecord.pricePerItem))
                          : "-"
                      }
                    />
                    <InfoRow
                      label="Total Transaksi"
                      value={formatRupiah(financeRecord.totalPrice)}
                    />
                    <InfoRow
                      label="Catatan Transaksi"
                      value={
                        <span className="italic text-muted-foreground">
                          {financeRecord.notes || "-"}
                        </span>
                      }
                    />

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Bukti Nota / Bukti Serah Terima
                      </p>
                      {financeRecord.image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={financeRecord.image}
                          alt="Nota Transaksi"
                          className="rounded-sm border object-cover max-h-52 w-full"
                        />
                      ) : (
                        <div className="rounded-sm border border-dashed bg-muted/20 flex flex-col items-center justify-center h-36 gap-2 text-muted-foreground">
                          <p className="text-xs">
                            Nota transaksi tidak tersedia
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <>
                    <p className="text-xs text-muted-foreground bg-muted/30 p-3 rounded-sm border border-muted mt-2">
                      Detail transaksi finansial belum atau tidak lengkap
                      tersimpan. Angka di atas berdasarkan estimasi harga
                      satuan.
                    </p>
                  </>
                )}
              </div>
            )}
          </div>
        </DefaultCard>
      </div>
    </div>
  );
}
