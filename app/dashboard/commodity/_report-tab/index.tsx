"use client";
import React, { useMemo, useRef, useState } from "react";
import { Commodity } from "@/types/comodity";
import DefaultCard from "@/components/card/default-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatDateShort } from "@/lib/utils/format-date";
import { LuFile } from "react-icons/lu";

interface CommodityReportTabProps {
  data: Commodity[];
  rentang_tanggal: string;
}

const CommodityReportTab: React.FC<CommodityReportTabProps> = ({
  data,
  rentang_tanggal,
}) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [exporting, setExporting] = useState(false);

  const handleExportPDF = async () => {
    if (!targetRef.current) return;
    setExporting(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const jsPDF = (await import("jspdf")).jsPDF;

      const canvas = await html2canvas(targetRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: "a4",
      });
      const pdfW = pdf.internal.pageSize.getWidth();
      const pdfH = pdf.internal.pageSize.getHeight();
      const ratio = canvas.height / canvas.width;
      const imgH = pdfW * ratio;

      let posY = 0;
      let remaining = imgH;
      let first = true;

      while (remaining > 0) {
        if (!first) pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, -posY, pdfW, imgH);
        posY += pdfH;
        remaining -= pdfH;
        first = false;
      }

      pdf.save("Laporan-Komoditas.pdf");
    } finally {
      setExporting(false);
    }
  };

  /* ── split in / out ── */
  const { inItems, outItems } = useMemo(() => {
    const inn: Commodity[] = [];
    const out: Commodity[] = [];
    data.forEach((item) => {
      if (item.type === "in") inn.push(item);
      else out.push(item);
    });
    return { inItems: inn, outItems: out };
  }, [data]);

  /* ── aggregates ── */
  const totalMasuk = inItems.reduce((s, i) => s + Number(i.quantity), 0);
  const totalKeluar = outItems.reduce(
    (s, i) => s + Math.abs(Number(i.quantity)),
    0,
  );
  const currentStock = totalMasuk - totalKeluar;

  /* ── group helpers ── */
  type GroupEntry = { items: Commodity[]; totalQty: number };
  const groupByCategory = (items: Commodity[]): Record<string, GroupEntry> => {
    const groups: Record<string, GroupEntry> = {};
    items.forEach((item) => {
      const key = item.category || "Tidak Berkategori";
      if (!groups[key]) groups[key] = { items: [], totalQty: 0 };
      groups[key].items.push(item);
      groups[key].totalQty += Math.abs(Number(item.quantity));
    });
    return groups;
  };

  const inGroups = useMemo(() => groupByCategory(inItems), [inItems]);
  const outGroups = useMemo(() => groupByCategory(outItems), [outItems]);

  const today = formatDate(new Date().toISOString());

  return (
    <div className="space-y-4">
      {/* ── actions ── */}
      <div className="flex justify-end gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleExportPDF}
          disabled={exporting}
          className="h-9 px-4 gap-2 border-primary text-primary hover:bg-primary/5"
        >
          <LuFile />
          {exporting ? "Mengekspor..." : "Export PDF"}
        </Button>
      </div>

      <DefaultCard className="overflow-hidden">
        <div ref={targetRef} className="bg-white p-4">
          {/* ── header ── */}
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold tracking-tight">
              Laporan Komoditas
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Smartfarm &mdash; Dicetak pada {today}
            </p>
            {rentang_tanggal && (
              <p className="text-sm text-muted-foreground mt-1">
                {rentang_tanggal}
              </p>
            )}
          </div>

          <Separator className="mb-5" />

          {/* ── summary cards ── */}
          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="rounded-sm border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Masuk</p>
              <p className="text-lg font-bold text-emerald-600">
                {totalMasuk.toLocaleString("id-ID")}{" "}
                <span className="text-xs font-normal">ekor</span>
              </p>
            </div>
            <div className="rounded-sm border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">Total Keluar</p>
              <p className="text-lg font-bold text-red-500">
                {totalKeluar.toLocaleString("id-ID")}{" "}
                <span className="text-xs font-normal">ekor</span>
              </p>
            </div>
            <div className="rounded-sm border border-border p-3 text-center">
              <p className="text-xs text-muted-foreground mb-1">
                Stok Saat Ini
              </p>
              <p
                className={`text-lg font-bold ${
                  currentStock >= 0 ? "text-black" : "text-red-500"
                }`}
              >
                {currentStock.toLocaleString("id-ID")}{" "}
                <span className="text-xs font-normal">ekor</span>
              </p>
            </div>
          </div>

          <Separator className="mb-5" />

          {/* ── IN section ── */}
          <CommodityReportSection
            title="KOMODITAS MASUK"
            groups={inGroups}
            totalQty={totalMasuk}
            colorClass="text-emerald-600"
            showPool
          />
          <div className="my-4" />

          {/* ── OUT section ── */}
          <CommodityReportSection
            title="KOMODITAS KELUAR"
            groups={outGroups}
            totalQty={totalKeluar}
            colorClass="text-red-500"
            showBuyer
          />

          <Separator className="my-5" />

          {/* ── net stock footer ── */}
          {/* <div
            className="flex items-center justify-between px-3 py-3 rounded-sm"
            style={{ backgroundColor: "#f3f4f6" }}
          >
            <span className="font-bold text-base">Stok Bersih (Masuk - Keluar)</span>
            <span
              className={`font-semibold text-base ${
                currentStock >= 0 ? "text-emerald-600" : "text-red-500"
              }`}
            >
              {currentStock.toLocaleString("id-ID")} ekor
            </span>
          </div> */}
        </div>
      </DefaultCard>
    </div>
  );
};

/* ─── Section sub-component ─────────────────────────────────────── */
interface CommodityReportSectionProps {
  title: string;
  groups: Record<string, { items: Commodity[]; totalQty: number }>;
  totalQty: number;
  colorClass: string;
  showPool?: boolean;
  showBuyer?: boolean;
}

const CommodityReportSection: React.FC<CommodityReportSectionProps> = ({
  title,
  groups,
  totalQty,
  colorClass,
  showPool = false,
  showBuyer = false,
}) => {
  const entries = Object.entries(groups);

  return (
    <div>
      {/* section title bar */}
      <div className="flex items-center justify-between bg-muted/70 px-3 py-2 rounded-sm mb-3">
        <span className="text-sm font-semibold uppercase tracking-wide">
          {title}
        </span>
      </div>

      {entries.length === 0 ? (
        <p className="text-xs text-muted-foreground px-2 py-1">
          Tidak ada data.
        </p>
      ) : (
        entries.map(([category, { items, totalQty: groupQty }]) => (
          <div key={category} className="mb-3">
            {/* group header */}
            <div className="flex items-center justify-between px-3 py-1.5 border-l-2 border-primary/40 bg-muted/30 mb-1">
              <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                {category == "Harvest" ? "Panen" : "Penjualan"}
              </span>
            </div>

            {/* item rows */}
            <div className="divide-y divide-border/50">
              {items.map((item, idx) => (
                <div
                  key={item.id + idx}
                  className="flex items-start justify-between px-3 py-1.5 text-xs hover:bg-muted/20 transition-colors"
                >
                  <div className="flex-1 pr-4">
                    <p className="text-foreground/80 leading-snug">
                      {formatDate(item.date)}
                      {showPool && item.poolName && (
                        <span className="ml-2 text-muted-foreground">
                          — Kolam: {item.poolName}
                        </span>
                      )}
                      {showBuyer && item.buyerName && (
                        <span className="ml-2 text-muted-foreground">
                          — Pembeli: {item.buyerName}
                        </span>
                      )}
                    </p>
                    <div className="flex gap-2 mt-0.5 flex-wrap">
                      {item.cycleStartDate && (
                        <span className="bg-muted px-1 py-0.5 rounded-sm text-muted-foreground">
                          Siklus: {formatDateShort(item.cycleStartDate)}
                        </span>
                      )}
                      {item.soldQuantity != null && item.type === "in" && (
                        <span className="bg-muted px-1 py-0.5 rounded-sm text-muted-foreground">
                          Terjual:{" "}
                          {Number(item.soldQuantity).toLocaleString("id-ID")}{" "}
                          ekor
                        </span>
                      )}
                    </div>
                  </div>
                  <span
                    className={`font-medium whitespace-nowrap ${colorClass}`}
                  >
                    {Math.abs(Number(item.quantity)).toLocaleString("id-ID")}{" "}
                    ekor
                  </span>
                </div>
              ))}
            </div>

            {/* group subtotal */}
            <div className="flex items-center justify-between px-3 py-1.5 border-t border-border/60 mt-1">
              <span className="text-xs font-semibold text-muted-foreground">
                Subtotal {category}
              </span>
              <span className={`text-xs font-bold ${colorClass}`}>
                {groupQty.toLocaleString("id-ID")} ekor
              </span>
            </div>
          </div>
        ))
      )}

      {/* section total */}
      <div className="flex items-center justify-between px-3 py-2 border-t-2 border-border mt-1">
        <span className="text-sm font-bold">
          Total {title.charAt(0) + title.slice(1).toLowerCase()}
        </span>
        <span className={`text-sm font-bold ${colorClass}`}>
          {totalQty.toLocaleString("id-ID")} ekor
        </span>
      </div>
    </div>
  );
};

export default CommodityReportTab;
