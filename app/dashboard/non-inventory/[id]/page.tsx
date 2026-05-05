"use client";

import DefaultCard from "@/components/card/default-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useFinanceBySourceId } from "@/lib/api/service/finance/useFinance";
import {
  useGetInventoryNotesByIdWithParams,
  useInventory,
  useInventoryById,
} from "@/lib/api/service/inventory/useInventory";
import { useGetProductById } from "@/lib/api/service/master-data/product/useProduct";
import { useNonInventory } from "@/lib/api/service/non-inventory/useNonInventory";
import { useGetUserById } from "@/lib/api/service/users/useUser";
import { inventoryTransactionTypeTranslation } from "@/lib/constants/type-inventory";
import { useBreadcrumbStore } from "@/lib/store/useBreadcrumbStore";
import { formatDate } from "@/lib/utils/format-date";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { InventoryResponseParamNote } from "@/types/inventory";
import { use, useEffect } from "react";

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

  /* Breadcrumb */
  useEffect(() => {
    if (productData) {
      setLabel("product", productData.data?.[0]?.name);
    }

    setLabel("inventory-notes", "Detail Catatan");
    return () => removeLabel("inventory");
  }, [productData, setLabel, removeLabel]);

  const financeRecord = financeData?.data?.[0];

  const isIncome = financeRecord?.type.toLowerCase() === "in";
  const badgeColor = isIncome
    ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
    : "bg-orange-500/10 text-orange-600 hover:bg-orange-500/20";
  const mainTypeColor = isIncome ? "text-emerald-600" : "text-orange-500";

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
      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <DefaultCard className="p-4 rounded-sm">
          <p className="text-xs text-muted-foreground mb-1">Tipe Catatan</p>
          <p className={`text-lg font-semibold capitalize ${mainTypeColor}`}>
            {isIncome ? "Masuk" : "Keluar"}
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
                {isIncome ? "Penambahan" : "Pengurangan"}
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
