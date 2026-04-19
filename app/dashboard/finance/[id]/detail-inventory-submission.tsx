"use client";

import DefaultCard from "@/components/card/default-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  useFinanceBySourceId,
  useFinanceInventorySubmission,
} from "@/lib/api/service/finance/useFinance";
import { useGetInventorySubmissionById } from "@/lib/api/service/inventory-submission/useInventorySubmission";
import {
  useGetInventorySubmissionByIdWithParams,
  useInventory,
} from "@/lib/api/service/inventory/useInventory";
import { useGetUserById } from "@/lib/api/service/users/useUser";
import { inventoryTransactionTypeTranslation } from "@/lib/constants/type-inventory";
import { useBreadcrumbStore } from "@/lib/store/useBreadcrumbStore";
import { formatDate } from "@/lib/utils/format-date";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { InventoryResponseParamSubmission } from "@/types/inventory";
import { useEffect } from "react";

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

const DetailInventorySubmissionNotes = ({ id }: { id: string }) => {
  const { setLabel, removeLabel } = useBreadcrumbStore();
  const { data: submissionData, isLoading: isLoadingInventoryDetailNotes } =
    useGetInventorySubmissionById(id);

  const {
    data: inventorySubmissionData,
    isLoading,
    isError,
  } = useFinanceInventorySubmission();

  const getRealOne = inventorySubmissionData?.find(
    (item) => item.sourceId === id,
  );

  const { data: financeData, isLoading: isLoadingFinance } =
    useFinanceBySourceId(id);

  /* Breadcrumb */
  useEffect(() => {
    setLabel(
      "inventory",
      submissionData?.data?.[0]?.product || "Detail Inventaris",
    );
    setLabel("inventory-submission", "Detail Pengajuan");
    return () => removeLabel("inventory");
  }, [submissionData?.data, id, setLabel, removeLabel]);

  const financeRecord = Array.isArray(financeData?.data)
    ? financeData?.data[0]
    : Array.isArray(financeData)
      ? financeData[0]
      : financeData;

  const getStatusLabelText = (status?: string | null) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "Disetujui";
      case "pending":
        return "Menunggu";
      case "rejected":
        return "Ditolak";
      default:
        return status || "-";
    }
  };

  const getStatusColor = (status?: string | null) => {
    switch (status?.toLowerCase()) {
      case "approved":
        return "text-emerald-600";
      case "pending":
        return "text-amber-500";
      case "rejected":
        return "text-rose-500";
      default:
        return "text-foreground";
    }
  };

  if (isLoadingInventoryDetailNotes || isLoadingFinance) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Memuat detail pengajuan...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DefaultCard className="p-4 rounded-sm">
          <p className="text-xs text-muted-foreground mb-1">Status Pengajuan</p>
          <p
            className={`text-lg font-semibold capitalize ${getStatusColor(submissionData?.data?.[0]?.status)}`}
          >
            {getStatusLabelText(submissionData?.data?.[0]?.status)}
          </p>
        </DefaultCard>

        <DefaultCard className="p-4 rounded-sm">
          <p className="text-xs text-muted-foreground mb-1">Tipe Transaksi</p>
          <p className="text-lg font-semibold text-foreground">
            {inventoryTransactionTypeTranslation(getRealOne?.transactionType) ||
              "-"}
          </p>
        </DefaultCard>

        <DefaultCard className="p-4 rounded-sm">
          <p className="text-xs text-muted-foreground mb-1">Kuantitas</p>
          <p className="text-lg font-semibold text-foreground">
            {Number(getRealOne?.quantity).toLocaleString("id-ID")}
          </p>
        </DefaultCard>

        <DefaultCard className="p-4 rounded-sm">
          <p className="text-xs text-muted-foreground mb-1">Total Nilai</p>
          <p className="text-lg font-semibold text-emerald-600">
            {formatRupiah(
              financeRecord?.totalPrice || getRealOne?.pricePerItem
                ? Number(getRealOne?.pricePerItem) *
                    Number(getRealOne?.quantity)
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <InfoRow label="Nama Produk" value={submissionData?.data?.[0]?.product} />
            <InfoRow label="Kategori Produk" value={submissionData?.data?.[0]?.category} />
            <InfoRow label="Unit Satuan" value={submissionData?.data?.[0]?.unit} />
          </div>
        </div>
      </DefaultCard>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DefaultCard className="rounded-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">Informasi Pengajuan</h3>
              <Badge
                variant="secondary"
                className={`text-xs bg-muted text-muted-foreground border-none`}
              >
                Pengajuan
              </Badge>
            </div>
            <Separator />
            <div className="space-y-4">
              <InfoRow label="ID Pengajuan" value={getRealOne?.sourceId} />
              <InfoRow
                label="Dibuat Oleh"
                value={submissionData?.data?.[0]?.user || "Sistem"}
              />
              <InfoRow
                label="Tanggal Pengajuan"
                value={formatDate(submissionData?.data?.[0]?.createdAt || "-")}
              />
              <InfoRow
                label="Kuantitas"
                value={`${Number(getRealOne?.quantity).toLocaleString("id-ID")}`}
              />
              <InfoRow
                label="Jenis Transaksi"
                value={inventoryTransactionTypeTranslation(
                  getRealOne?.transactionType,
                )}
              />
              <InfoRow
                label="Catatan Pengajuan"
                value={
                  <span className="italic text-muted-foreground">
                    {getRealOne?.notes || "-"}
                  </span>
                }
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

            {!financeRecord && !getRealOne?.pricePerItem ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Tidak ada data finansial untuk pengajuan ini.
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
                        getRealOne?.pricePerItem
                          ? formatRupiah(Number(getRealOne?.pricePerItem))
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
                      Pengajuan belum diproses menjadi transaksi final (Nota
                      belum terbit). Angka di atas berdasarkan estimasi awal.
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
};

export default DetailInventorySubmissionNotes;
