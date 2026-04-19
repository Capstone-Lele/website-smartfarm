"use client";

import DefaultCard from "@/components/card/default-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils/format-date";
import {
  LuCalendar,
  LuFileText,
  LuImage,
  LuPackage,
  LuScale,
  LuUser,
} from "react-icons/lu";
import { FaFish } from "react-icons/fa";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useGetBuyerById } from "@/lib/api/service/master-data/buyer/useBuyer";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { useCommodityByIdAndType } from "@/lib/api/service/commodity/useCommodity";
import { useFinanceBySourceId } from "@/lib/api/service/finance/useFinance";
import { CommodityByIdAndSourceIdItems } from "@/types/comodity";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium break-words">{value}</p>
      </div>
    </div>
  );
}

function SaleItemCard({
  item,
  index,
}: {
  item: CommodityByIdAndSourceIdItems;
  index: number;
}) {
  const [isOpen, setIsOpen] = useState(index === 0);

  return (
    <div className="rounded-sm border bg-muted/10 overflow-hidden">
      {/* Header */}
      <div
        className="flex items-center justify-between p-3.5 cursor-pointer hover:bg-muted/20 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          {isOpen ? (
            <ChevronUp size={17} className="text-muted-foreground" />
          ) : (
            <ChevronDown size={17} className="text-muted-foreground" />
          )}
          <span className="text-sm font-semibold">Item #{index + 1}</span>
          {!isOpen && (
            <span className="text-xs text-muted-foreground ml-2 truncate max-w-[160px]">
              Hasil Panen: {item.harvestDate} | {item.poolName}
            </span>
          )}
        </div>
        <Badge variant="outline" className="text-xs">
          {formatRupiah(item.subTotal)}
        </Badge>
      </div>

      {isOpen && (
        <div className="p-4 pt-0 space-y-3">
          <Separator className="mb-3" />
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-0.5">
                Hasil Panen
              </p>
              <p className="font-medium">
                {item.harvestDate} | {item.poolName}
              </p>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-1">
              <div className="rounded-md bg-muted/30 p-2.5 text-center">
                <p className="text-xs text-muted-foreground">Jumlah</p>
                <p className="font-semibold">{item.quantity} ekor</p>
              </div>
              <div className="rounded-md bg-muted/30 p-2.5 text-center">
                <p className="text-xs text-muted-foreground">Berat</p>
                <p className="font-semibold">{item.quantityKg} kg</p>
              </div>
              <div className="rounded-md bg-muted/30 p-2.5 text-center">
                <p className="text-xs text-muted-foreground">Harga/kg</p>
                <p className="font-semibold">
                  {new Intl.NumberFormat("id-ID").format(item.priceKg)}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between bg-primary/5 px-3 py-2 mt-1">
              <span className="text-xs text-muted-foreground">Subtotal</span>
              <span className="font-semibold text-primary">
                {formatRupiah(item.subTotal)}
              </span>
            </div>
            {item.notes && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  Catatan Item
                </p>
                <p className="text-sm italic text-muted-foreground">
                  {item.notes}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Main Component                                                              */
/* -------------------------------------------------------------------------- */

const DetailCommodity = ({ id }: { id: string }) => {
    console.log("DetailCommodity rendered with id:", id);
  const { data: dataCommodity, isLoading: isLoadingCommodity } =
    useCommodityByIdAndType(id, "in");
  const { data: dataBuyer, isLoading: isLoadingBuyer } = useGetBuyerById(
    dataCommodity?.data[0]?.buyerId || "",
  );
  const { data: dataFinance, isLoading: isLoadingFinance } =
    useFinanceBySourceId(id);

  return (
    <div className="space-y-6">
      {/* ── Summary Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Item",
            value: `${dataCommodity?.data?.[0]?.orderItems?.length || 0}`,
            color: "text-primary",
          },
          {
            label: "Total Ekor",
            value: `${(dataCommodity?.data?.[0]?.orderItems?.reduce((s, i) => s + Number(i.quantity || 0), 0) || 0).toLocaleString("id-ID")} ekor`,
            color: "text-foreground",
          },
          {
            label: "Total Berat",
            value: `${dataCommodity?.data?.[0]?.orderItems?.reduce((s, i) => s + Number(i.quantityKg || 0), 0) || 0} kg`,
            color: "text-foreground",
          },
          {
            label: "Total Harga",
            value: formatRupiah(dataFinance?.data?.[0]?.totalPrice || 0),
            color: "text-emerald-600",
          },
        ].map((card, i) => (
          <DefaultCard key={i} className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
            <p className={`text-lg font-bold ${card.color}`}>{card.value}</p>
          </DefaultCard>
        ))}
      </div>

      {/* ── 2 Column Layout ────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* LEFT: Main Transaction Info */}
        <div className="space-y-5">
          {/* Buyer Info */}
          <DefaultCard>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">Informasi Pembeli</h3>
              </div>
              <Separator />
              <div className="space-y-4">
                <InfoRow
                  label="Nama Pembeli"
                  value={dataBuyer?.data[0]?.name || "-"}
                />
                <InfoRow label="Tipe" value={dataBuyer?.data[0]?.type || "-"} />
                <InfoRow
                  label="No. Telepon"
                  value={dataBuyer?.data[0]?.phone || "-"}
                />
                <InfoRow
                  label="Email"
                  value={dataBuyer?.data[0]?.email || "-"}
                />
                <InfoRow
                  label="Alamat"
                  value={dataBuyer?.data[0]?.address || "-"}
                />
              </div>
            </div>
          </DefaultCard>

          {/* Transaction Info */}
          <DefaultCard>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">Informasi Transaksi</h3>
              </div>
              <Separator />
              <div className="space-y-4">
                <InfoRow
                  label="ID Transaksi"
                  value={dataFinance?.data?.[0]?.id || "-"}
                />
                <InfoRow
                  label="Tanggal Order"
                  value={formatDate(dataFinance?.data?.[0]?.transactionDate || "")}
                />
                <InfoRow
                  label="Total Harga"
                  value={formatRupiah(dataFinance?.data?.[0]?.totalPrice || 0)}
                />
                <InfoRow
                  label="Catatan Transaksi"
                  value={dataFinance?.data?.[0]?.notes || "-"}
                />
              </div>

              {/* Nota / Image */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  Nota Penjualan
                </p>
                {dataFinance?.data?.[0]?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={dataFinance?.data?.[0]?.image}
                    alt="Nota Penjualan"
                    className="rounded-md border object-cover max-h-52 w-full"
                  />
                ) : (
                  <div className="rounded-md border border-dashed bg-muted/20 flex flex-col items-center justify-center h-36 gap-2 text-muted-foreground">
                    <LuImage size={28} />
                    <p className="text-xs">Nota belum tersedia</p>
                  </div>
                )}
              </div>
            </div>
          </DefaultCard>
        </div>

        {/* RIGHT: Item List (Accordion) */}
        <DefaultCard>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-sm">Daftar Item Komoditas</h3>
              </div>
              <Badge
                variant="secondary"
                className="text-white bg-primary hover:bg-primary/90"
              >
                {dataCommodity?.data?.[0]?.orderItems?.length || 0} item
              </Badge>
            </div>
            <Separator />

            <div className="space-y-3">
              {dataCommodity?.data?.[0]?.orderItems?.map((item, index) => (
                <SaleItemCard key={item.id} item={item} index={index} />
              ))}
            </div>

            {/* Grand total bar */}
            <div className="flex items-center justify-between rounded-md border bg-gray-100 px-4 py-3 mt-2">
              <span className="text-sm font-semibold">Total Keseluruhan</span>
              <span className="text-base font-bold ">
                {formatRupiah(dataFinance?.data?.[0]?.totalPrice || 0)}
              </span>
            </div>
          </div>
        </DefaultCard>
      </div>
    </div>
  );
};

export default DetailCommodity;
