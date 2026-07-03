"use client";

import DefaultCard from "@/components/card/default-card";
import { ButtonCopy } from "@/components/button-copy";
import ButtonRedirectColumn from "@/components/button-column/button-redirect-column";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDate } from "@/lib/utils/format-date";
import { LuArrowLeftRight, LuImage, LuRepeat2 } from "react-icons/lu";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { useGetBuyerById } from "@/lib/api/service/master-data/buyer/useBuyer";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { useCommodityByIdAndType } from "@/lib/api/service/commodity/useCommodity";
import { useFinanceBySourceId } from "@/lib/api/service/finance/useFinance";
import { CommodityByIdAndSourceIdItems } from "@/types/comodity";
import { useDetailCycle } from "@/lib/api/service/cycles/useCycle";
import { FinanceBySourceId } from "@/types/finance/finance";

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
  isReversal,
}: {
  item: CommodityByIdAndSourceIdItems;
  index: number;
  isReversal?: boolean;
}) {
  const [isOpen, setIsOpen] = useState(index === 0);
  const { data: dataCycle, isLoading: isLoadingCycle } = useDetailCycle(
    item.cycleId || "",
  );
  const cycleStartDate = dataCycle?.data?.[0]?.startDate
    ? formatDate(dataCycle.data[0].startDate)
    : "-";
  const itemSubTotal = isReversal
    ? Number(item.priceKg || 0) * Number(item.quantityKg || 0)
    : (item.subTotal || 0);
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
          {formatRupiah(itemSubTotal)}
        </Badge>
      </div>

      {isOpen && (
        <div className="p-4 pt-0 space-y-3">
          <Separator className="mb-3" />
          <div className="grid grid-cols-1 gap-2 text-sm">
            <div className="flex flex-wrap justify-between items-center">
              <p className="text-xs text-muted-foreground mb-0.5">
                Hasil Panen
              </p>
              <p className="font-medium">
                {item.harvestDate} | {item.poolName} | Siklus:{" "}
                {isLoadingCycle ? "Loading..." : cycleStartDate}
              </p>
            </div>
            <div className="space-y-1.5 mt-2 border-t pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Jumlah</span>
                <span className="text-sm font-medium">
                  {item.quantity} ekor
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Berat</span>
                <span className="text-sm font-medium">
                  {item.quantityKg} kg
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Harga/kg</span>
                <span className="text-sm font-medium">
                  {formatRupiah(item.priceKg)}
                </span>
              </div>
              <div className="flex items-center justify-between border-t pt-1.5 mt-1.5">
                <span className="text-xs text-muted-foreground font-semibold">
                  Subtotal
                </span>
                <span className="font-bold text-primary">
                  {formatRupiah(itemSubTotal)}
                </span>
              </div>
            </div>
            {item.notes && (
              <div>
                <p className="text-xs text-muted-foreground mb-0.5">
                  Catatan Item :
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
              Transaksi penjualan komoditas ini sudah pernah dilakukan reversal.
              Berikut adalah referensi ke transaksi reversal-nya.
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
                    href={`/dashboard/commodity/${reversalNoteId}`}
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
                    href={`/dashboard/commodity/${referenceSourceId}`}
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

/* -------------------------------------------------------------------------- */
/*  Main Component                                                              */
/* -------------------------------------------------------------------------- */

const DetailOut = ({ id }: { id: string }) => {
  const { data: dataCommodity } = useCommodityByIdAndType(id, "in");
  const { data: dataBuyer } = useGetBuyerById(
    dataCommodity?.data[0]?.buyerId || "",
  );
  const { data: dataFinance } = useFinanceBySourceId(id);

  const financeRecord = dataFinance?.data
    ? Array.isArray(dataFinance.data)
      ? dataFinance.data[0]
      : dataFinance.data
    : Array.isArray(dataFinance)
      ? dataFinance[0]
      : null;

  const isReversal = !!financeRecord?.isReversed;
  const orderItems = dataCommodity?.data?.[0]?.orderItems || [];
  const calculatedTotalPrice = orderItems.reduce(
    (sum, item) => sum + (Number(item.priceKg || 0) * Number(item.quantityKg || 0)),
    0
  );
  const displayTotalPrice = isReversal ? calculatedTotalPrice : (financeRecord?.totalPrice || 0);

  return (
    <div className="space-y-6">
      <ReversalTransactionCard
        financeRecord={financeRecord as ReversalFinanceRecord | null}
      />

      {/* ── Summary Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Item",
            value: `${orderItems.length || 0}`,
            color: "text-primary",
          },
          {
            label: "Total Ekor",
            value: `${(orderItems.reduce((s, i) => s + Number(i.quantity || 0), 0) || 0).toLocaleString("id-ID")} ekor`,
            color: "text-foreground",
          },
          {
            label: "Total Berat",
            value: `${orderItems.reduce((s, i) => s + Number(i.quantityKg || 0), 0) || 0} kg`,
            color: "text-foreground",
          },
          {
            label: "Total Harga",
            value: formatRupiah(displayTotalPrice),
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
                  value={financeRecord?.id || "-"}
                />
                <InfoRow
                  label="Tanggal Order"
                  value={formatDate(financeRecord?.transactionDate || "")}
                />
                <InfoRow
                  label="Total Harga"
                  value={formatRupiah(displayTotalPrice)}
                />
                <InfoRow
                  label="Catatan Transaksi"
                  value={financeRecord?.notes || "-"}
                />
              </div>

              {/* Nota / Image */}
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                  Nota Penjualan
                </p>
                {financeRecord?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={financeRecord.image}
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
                <h3 className="font-semibold text-sm">
                  Daftar Order Item Komoditas
                </h3>
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
              {orderItems.map((item, index) => (
                <SaleItemCard key={item.id} item={item} index={index} isReversal={isReversal} />
              ))}
            </div>

            {/* Grand total bar */}
            <div className="flex items-center justify-between rounded-sm border bg-gray-100 px-4 py-3 mt-2">
              <span className="text-sm font-semibold">Total Keseluruhan</span>
              <span className="text-base font-bold ">
                {formatRupiah(displayTotalPrice)}
              </span>
            </div>
          </div>
        </DefaultCard>
      </div>
    </div>
  );
};

export default DetailOut;
