"use client";
import React, { useMemo, useRef, useState } from "react";
import { Finance } from "@/types/finance/finance";
import { SelectCombobox } from "@/components/combobox/select";
import DefaultCard from "@/components/card/default-card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatDate, formatDateShort } from "@/lib/utils/format-date";
import { formatRupiah } from "@/lib/utils/format-rupiah";
import { sourceLabelTranslation } from "@/lib/constants/type-finance";
import { LuFile } from "react-icons/lu";


interface FinanceReportTabProps {
  data: Finance[];
  rentang_tanggal: string;
}

const FinanceReportTab: React.FC<FinanceReportTabProps> = ({ data, rentang_tanggal }) => {
  const targetRef = useRef<HTMLDivElement>(null);
  const [txTypeFilter, setTxTypeFilter] = useState<string>("all");
  const [sourceFilter, setSourceFilter] = useState<string>("all");
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
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
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

      pdf.save("Laporan-Laba-Rugi.pdf");
    } finally {
      setExporting(false);
    }
  };

  /* ── filtered data ── */
  const filtered = useMemo(() => {
    return data.filter((item) => {
      const matchType =
        txTypeFilter === "all" ||
        (txTypeFilter === "grant" && item.transactionType === "grant") ||
        (txTypeFilter === "non-grant" && item.transactionType !== "grant");

      const matchSource =
        sourceFilter === "all" ||
        item.transactionSource === sourceFilter;

      return matchType && matchSource;
    });
  }, [data, txTypeFilter, sourceFilter]);

  /* ── income vs expense ── */
  const { incomeItems, expenseItems, totalIncome, totalExpense, netProfit } =
    useMemo(() => {
      const inc: Finance[] = [];
      const exp: Finance[] = [];

      filtered.forEach((item) => {
        if (item.type === "in" || item.type === "IN") {
          inc.push(item);
        } else {
          exp.push(item);
        }
      });

      const totalIn = inc.reduce((s, i) => s + (i.totalPrice || 0), 0);
      const totalOut = exp.reduce((s, i) => s + (i.totalPrice || 0), 0);

      return {
        incomeItems: inc,
        expenseItems: exp,
        totalIncome: totalIn,
        totalExpense: totalOut,
        netProfit: totalIn - totalOut,
      };
    }, [filtered]);

  /* ── group by source ── */
  const groupBySource = (items: Finance[]) => {
    const groups: Record<string, { items: Finance[]; total: number }> = {};
    items.forEach((item) => {
      const src = item.transactionSource || "other";
      if (!groups[src]) groups[src] = { items: [], total: 0 };
      groups[src].items.push(item);
      groups[src].total += item.totalPrice || 0;
    });
    return groups;
  };

  const incomeGroups = useMemo(() => groupBySource(incomeItems), [incomeItems]);
  const expenseGroups = useMemo(
    () => groupBySource(expenseItems),
    [expenseItems]
  );

  const today = formatDate(new Date().toISOString());

  return (
    <div className="space-y-4">
      {/* ── filters ── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="w-full sm:w-56">
          <SelectCombobox
            data={[
              { label: "Semua Tipe", value: "all" },
              { label: "Reguler (Non-Grant)", value: "non-grant" },
              { label: "Hibah (Grant)", value: "grant" },
            ]}
            onValueChange={setTxTypeFilter}
            label="Tipe Transaksi"
          />
        </div>
        <div className="w-full sm:w-64">
          <SelectCombobox
            data={[
              { label: "Semua Sumber", value: "all" },
              { label: "Non Inventaris", value: "non_inventaris" },
              { label: "Penjualan Komoditas", value: "comodity_sale" },
              { label: "Catatan Inventaris", value: "inventory_notes" },
              { label: "Pengajuan Inventaris", value: "inventory_submission" },
            ]}
            onValueChange={setSourceFilter}
            label="Sumber Transaksi"
          />
        </div>
        <div className="sm:ml-auto">
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
      </div>

      <DefaultCard className="overflow-hidden">
        <div ref={targetRef} className="bg-white p-4">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-semibold tracking-tight">
              Laporan Laba Rugi
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Smartfarm &mdash; Dicetak pada {today}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
                {rentang_tanggal}
            </p>
            <div className="flex flex-wrap justify-center gap-3 mt-2 text-xs text-muted-foreground">
              <span className="bg-muted px-2 py-0.5 rounded-sm">
                Tipe:{" "}
                <b>
                  {txTypeFilter === "all"
                    ? "Semua"
                    : txTypeFilter === "grant"
                    ? "Hibah (Grant)"
                    : "Reguler (Non-Grant)"}
                </b>
              </span>
              <span className="bg-muted px-2 py-0.5 rounded-sm">
                Sumber:{" "}
                <b>
                  {sourceFilter === "all"
                    ? "Semua"
                    : sourceLabelTranslation(sourceFilter)}
                </b>
              </span>
            </div>
          </div>

          <Separator className="mb-5" />

          <ReportSection
            title="PEMASUKAN"
            groups={incomeGroups}
            total={totalIncome}
            colorClass="text-green-600"
          />

          <div className="my-4" />

          <ReportSection
            title="PENGELUARAN"
            groups={expenseGroups}
            total={totalExpense}
            colorClass="text-red-500"
          />

          <Separator className="my-5" />

          <div className="flex items-center justify-between px-3 py-3 rounded-sm" style={{ backgroundColor: '#f3f4f6' }}>
            <span className="font-bold text-base">Laba / Rugi</span>
            <span
              className={`font-semibold text-base ${
                netProfit >= 0 ? "text-green-600" : "text-red-500"
              }`}
            >
              {formatRupiah(netProfit)}
            </span>
          </div>
        </div>
      </DefaultCard>
    </div>
  );
};

/* ─── Section sub-component ──────────────────────────────────────── */
interface ReportSectionProps {
  title: string;
  groups: Record<string, { items: Finance[]; total: number }>;
  total: number;
  colorClass: string;
}

const ReportSection: React.FC<ReportSectionProps> = ({
  title,
  groups,
  total,
  colorClass,
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
        entries.map(([src, { items, total: groupTotal }]) => (
          <div key={src} className="mb-3">
            {/* group header */}
            <div className="flex items-center justify-between px-3 py-1.5 border-l-2 border-primary/40 bg-muted/30 mb-1">
              <span className="text-xs font-semibold text-foreground/70 uppercase tracking-wide">
                {sourceLabelTranslation(src)}
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
                      {item.notes.length > 50
                        ? `${item.notes.substring(0, 50)}...`
                        : item.notes}
                    </p>
                    <p className="text-muted-foreground mt-0.5">
                      {formatDateShort(item.transactionDate)}
                      {item.transactionType && (
                        <span className="ml-2 bg-muted px-1 py-0.5 rounded-sm">
                          {item.transactionType === "grant" ? "Hibah" : "Reguler"}
                        </span>
                      )}
                    </p>
                  </div>
                  <span className={`font-medium whitespace-nowrap`}>
                    {formatRupiah(item.totalPrice || 0)}
                  </span>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between px-3 py-1.5 border-t border-border/60 mt-1">
              <span className="text-xs font-semibold text-muted-foreground">
                Subtotal{" "}
                {sourceLabelTranslation(src)}
              </span>
              <span className={`text-xs font-bold ${colorClass}`}>
                {formatRupiah(groupTotal)}
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
          {formatRupiah(total)}
        </span>
      </div>
    </div>
  );
};
export default FinanceReportTab;
