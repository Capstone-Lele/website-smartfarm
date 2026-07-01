"use client";

import DefaultCard from "@/components/card/default-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useFinanceBySourceId } from "@/lib/api/service/finance/useFinance";
import {
  useGetInventoryNotesByIdWithParams,
  useInventory,
} from "@/lib/api/service/inventory/useInventory";
import { useGetUserById } from "@/lib/api/service/users/useUser";
import { inventoryTransactionTypeTranslation } from "@/lib/constants/type-inventory";
import { useBreadcrumbStore } from "@/lib/store/useBreadcrumbStore";
import { formatDate } from "@/lib/utils/format-date";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { InventoryResponseParamNote } from "@/types/inventory";
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

const DetailInventoryNotesOut = ({
  id, // inventory id
  source, // notes id
}: {
  id: string;
  source: string;
}) => {
  const { setLabel, removeLabel } = useBreadcrumbStore();
  const {
    data: inventoryDetailDataNotes,
    isLoading: isLoadingInventoryDetailNotes,
  } = useGetInventoryNotesByIdWithParams(id, { inventoryType: "note" });
  const { data: inventoryData } = useInventory();
  const getRealOne = inventoryDetailDataNotes?.data?.find(
    (item: InventoryResponseParamNote) => item.id === source,
  );
  console.log("getRealOne", getRealOne);

  const { data: userData, isLoading: isLoadingUser } = useGetUserById(
    getRealOne?.userId || "",
  );

  /* Breadcrumb */
  useEffect(() => {
    if (inventoryData?.data) {
      const inventory = inventoryData.data.find((item) => item.id === id);
      if (inventory?.product) {
        setLabel("inventory", inventory.product);
      }
    }
    setLabel("inventory-notes", "Detail Catatan");
    return () => removeLabel("inventory");
  }, [inventoryData?.data, id, setLabel, removeLabel]);

  const reportingUser = Array.isArray(userData?.data)
    ? userData?.data[0]
    : userData?.data;

  const isIncome = getRealOne?.type.toLowerCase() === "in";
  const badgeColor = isIncome
    ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
    : "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20";
  const mainTypeColor = isIncome ? "text-emerald-600" : "text-orange-500";

  if (isLoadingInventoryDetailNotes || isLoadingUser ) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Memuat detail catatan...
      </div>
    );
  }

  if (!getRealOne) {
    return (
      <div className="p-8 text-center text-sm text-muted-foreground">
        Catatan tidak ditemukan.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DefaultCard className="p-4 rounded-sm">
          <p className="text-xs text-muted-foreground mb-1">Tipe Catatan</p>
          <p className={`text-lg font-semibold capitalize ${mainTypeColor}`}>
            {isIncome ? "Masuk" : "Keluar"}
          </p>
        </DefaultCard>

        <DefaultCard className="p-4 rounded-sm">
          <p className="text-xs text-muted-foreground mb-1">Kuantitas Pemakaian</p>
          <p className="text-lg font-semibold text-foreground">
            {Number(getRealOne.quantity).toLocaleString("id-ID")}
          </p>
        </DefaultCard>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DefaultCard className="rounded-sm">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">Informasi Catatan</h3>
              <Badge
                variant="secondary"
                className={`text-xs ${badgeColor} border-none`}
              >
                Pengurangan
              </Badge>
            </div>
            <Separator />
            <div className="space-y-4">
              <InfoRow label="ID Catatan" value={getRealOne.id} />
              <InfoRow
                label="Dibuat Oleh"
                value={reportingUser?.name || "Sistem"}
              />
              <InfoRow
                label="Tanggal Pelaporan"
                value={formatDate(
                  getRealOne.reportDate || getRealOne.createdAt,
                )}
              />
              <InfoRow
                label="Kuantitas Pemakaian"
                value={`${Number(getRealOne.quantity).toLocaleString("id-ID")}`}
              />
              <InfoRow
                label="Jenis Transaksi"
                value={inventoryTransactionTypeTranslation(
                  getRealOne.transactionType,
                )}
              />
              <InfoRow
                label="Catatan Tersimpan"
                value={
                  <span className="italic text-muted-foreground">
                    {getRealOne.notes || "-"}
                  </span>
                }
              />

              <div>
                <p className="text-xs text-muted-foreground mb-2">
                  Lampiran Bukti Penggunaan
                </p>
                {getRealOne.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={getRealOne.image}
                    alt="Lampiran Bukti Penggunaan"
                    className="rounded-sm border object-cover max-h-52 w-full"
                  />
                ) : (
                  <div className="rounded-sm border border-dashed bg-muted/20 flex flex-col items-center justify-center h-36 gap-2 text-muted-foreground">
                    <p className="text-xs">Gambar lampiran tidak tersedia</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DefaultCard>
      </div>
    </div>
  );
};

export default DetailInventoryNotesOut;
