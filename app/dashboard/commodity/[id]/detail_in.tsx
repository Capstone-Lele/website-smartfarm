"use client";

import DefaultCard from "@/components/card/default-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  useCommodityByIdAndType,
  useCommodityByIdAndTypeOut,
} from "@/lib/api/service/commodity/useCommodity";
import {
  useHarvestById,
  useListHarvest,
} from "@/lib/api/service/notes/harvest/useHarvest";
import { formatDate } from "@/lib/utils/format-date";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { FaFish } from "react-icons/fa";
import {
  LuCalendar,
  LuHash,
  LuImage,
  LuInfo,
  LuPackage,
  LuScale,
  LuUser,
} from "react-icons/lu";

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium wrap-break-word">{value}</p>
      </div>
    </div>
  );
}

const DetailIn = ({ id }: { id: string }) => {
  const { data: harvestData, isLoading: harvestLoading } = useHarvestById(id);
  const { data: harvestListData, isLoading: HarvestListLoading } =
    useListHarvest();
  const { data: commodityData, isLoading: commodityLoading } =
    useCommodityByIdAndTypeOut(id, "out");

  const FilteredDataByHarvestId = harvestListData?.data?.find(
    (item) => item.id === id,
  );
  const dataPanen = {
    pool: FilteredDataByHarvestId?.poolName || "N/A",
    cycle: FilteredDataByHarvestId?.cycle || "N/A",
    harvestDate: FilteredDataByHarvestId?.date || "N/A",
    staff: FilteredDataByHarvestId?.user || "N/A",
    amountFish: FilteredDataByHarvestId?.amount || 0,
    imageReport: FilteredDataByHarvestId?.image || "",
  };

  const totalPanen =
    harvestData?.data?.[0]?.amount || dataPanen.amountFish || 0;
  const totalTerjual =
    commodityData?.data?.reduce(
      (acc, curr) => acc + (Number(curr.quantity) || 0),
      0,
    ) || 0;
  const sisaStok = totalPanen - totalTerjual;
  const totalPendapatan =
    commodityData?.data?.reduce(
      (acc, curr) => acc + (Number(curr.totalPrice) || 0),
      0,
    ) || 0;

  console.log("harvestData", harvestData?.data?.[0]?.amount);
  return (
    <div className="space-y-6">
      {/* ── Summary Cards ──────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            label: "Total Panen",
            value: `${totalPanen.toLocaleString("id-ID")} ekor`,
          },
          {
            label: "Sudah Terjual / Keluar",
            value: `${totalTerjual.toLocaleString("id-ID")} ekor`,
          },
          {
            label: "Sisa Stok",
            value: `${sisaStok.toLocaleString("id-ID")} ekor`,
          },
          {
            label: "Total Pendapatan",
            value: formatRupiah(totalPendapatan),
            color: "text-emerald-600",
          },
        ].map((card, i) => (
          <DefaultCard key={i} className="p-4">
            <p className="text-xs text-muted-foreground mb-1">{card.label}</p>
            <p className={`text-lg font-semibold ${card.color}`}>{card.value}</p>
          </DefaultCard>
        ))}
      </div>

      {/* ── 2 Columns: Harvest Note + Reduction List ─────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <DefaultCard>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">Informasi Catatan Panen</h3>
            </div>
            <Separator />
            <div className="space-y-4">
              <InfoRow label="Kolam" value={dataPanen.pool} />
              <InfoRow label="Siklus" value={formatDate(dataPanen.cycle)} />
              <InfoRow
                label="Tanggal Panen"
                value={formatDate(dataPanen.harvestDate)}
              />
              <InfoRow label="Petugas Pelaksana" value={dataPanen.staff} />
              <InfoRow
                label="Total Ikan"
                value={`${dataPanen.amountFish} ekor`}
              />
              {/* Image Report */}
              {dataPanen.imageReport ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={dataPanen.imageReport}
                  alt="Gambar Laporan Panen"
                  className="rounded-md border object-cover max-h-52 w-full"
                />
              ) : (
                <div className="rounded-md border border-dashed bg-muted/20 flex flex-col items-center justify-center h-36 gap-2 text-muted-foreground">
                  <LuImage size={28} />
                  <p className="text-xs">Gambar laporan panen belum tersedia</p>
                </div>
              )}
            </div>
          </div>
        </DefaultCard>

        {/* RIGHT: Stock Reduction List */}
        <DefaultCard>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-sm">
                Riwayat Pengurangan Stok
              </h3>
              <Badge variant={"default"} className="text-xs">
                Penjualan
              </Badge>
            </div>
            <Separator />

            {commodityData?.data.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                Belum ada pengurangan stok.
              </p>
            ) : (
              <div className="space-y-3">
                {commodityData?.data.map((item, i) => (
                  <div
                    key={item.id}
                    className="rounded-sm border p-3.5 space-y-2 bg-muted/10"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-muted-foreground">
                          #{i + 1}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(item.orderDate)}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                      <div>
                        <span className="text-muted-foreground">Pembeli: </span>
                        <span className="font-medium">{item.buyer}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Jumlah: </span>
                        <span className="font-medium">
                          {item.quantity} ekor / {item.quantityKg} kg
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="text-muted-foreground">Total: </span>
                        <span className="font-semibold text-emerald-600">
                          {formatRupiah(Number(item.totalPrice))}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </DefaultCard>
      </div>
    </div>
  );
};

export default DetailIn;
