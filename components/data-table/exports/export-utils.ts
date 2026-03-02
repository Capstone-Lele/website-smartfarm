import type { RefObject } from "react";

interface ExportPdfOptions {
  title: string;
  fileName?: string;
}

/**
 * Screenshot elemen HTML via html2canvas lalu embed ke jsPDF.
 * Header (logo + judul + tanggal) digambar di atas setiap halaman.
 */
export async function exportTableToPdf(
  tableRef: RefObject<HTMLElement | null>,
  options: ExportPdfOptions,
): Promise<void> {
  if (!tableRef.current) return;

  // ── Lazy import (browser-only) ────────────────────────────────────────────
  const [html2canvasModule, jsPDFModule] = await Promise.all([
    import("html2canvas-pro"),
    import("jspdf"),
  ]);
  const html2canvas = html2canvasModule.default;
  const jsPDF = jsPDFModule.default;

  const { title, fileName } = options;

  // ── Screenshot tabel ──────────────────────────────────────────────────────
  // html2canvas-pro mendukung oklch() / lab() secara native (tidak perlu workaround)
  const canvas = await html2canvas(tableRef.current, {
    scale: 2,
    useCORS: true,
    backgroundColor: "#ffffff",
    logging: false,
  });

  // ── Setup PDF (A4 Landscape) ───────────────────────────────────────────────
  const pdf = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });

  const PAGE_W = pdf.internal.pageSize.getWidth(); // 297mm
  const PAGE_H = pdf.internal.pageSize.getHeight(); // 210mm

  const HEADER_H = 20; // tinggi area header (mm)
  const MARGIN = 8; // margin kiri-kanan (mm)
  const FOOTER_H = 8; // tinggi area footer (mm)

  const contentW = PAGE_W - MARGIN * 2; // lebar konten (mm)
  const contentH = PAGE_H - HEADER_H - FOOTER_H - MARGIN; // tinggi area tabel per halaman (mm)

  // Konversi canvas ke mm
  const imgW = contentW;
  const imgH = (canvas.height / canvas.width) * imgW;

  const totalPages = Math.ceil(imgH / contentH);
  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const timeStr = now.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // ── Render halaman ────────────────────────────────────────────────────────
  for (let page = 0; page < totalPages; page++) {
    if (page > 0) pdf.addPage();

    // Header background
    pdf.setFillColor("#ffffff");
    pdf.rect(0, 0, PAGE_W, HEADER_H, "F");

    // Border bawah header
    pdf.setDrawColor("#e5e7eb");
    pdf.setLineWidth(0.5);
    pdf.line(0, HEADER_H, PAGE_W, HEADER_H);

    // Judul laporan (tengah)
    pdf.setTextColor("#000000");
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");
    pdf.text(title, PAGE_W / 2, HEADER_H / 2 + 1.5, { align: "center" });

    // Nama sistem (kiri)
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "bold");
    pdf.text("SmartFarm", MARGIN, HEADER_H / 2 - 1);
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.text("Sistem Monitoring Budidaya Lele", MARGIN, HEADER_H / 2 + 3);

    // Tanggal cetak (kanan)
    pdf.setFontSize(7);
    pdf.text(`Dicetak: ${dateStr}`, PAGE_W - MARGIN, HEADER_H / 2 - 1, {
      align: "right",
    });
    pdf.text(`${timeStr} WIB`, PAGE_W - MARGIN, HEADER_H / 2 + 3, {
      align: "right",
    });

    // Potong slice gambar untuk halaman ini
    const sliceY = page * contentH; // dalam mm
    const sliceH = Math.min(contentH, imgH - sliceY); // mm

    // Buat canvas potongan
    const sliceCanvas = document.createElement("canvas");
    const pxPerMm = canvas.width / imgW;
    sliceCanvas.width = canvas.width;
    sliceCanvas.height = Math.round(sliceH * pxPerMm);
    const ctx = sliceCanvas.getContext("2d")!;
    ctx.drawImage(
      canvas,
      0,
      Math.round(sliceY * pxPerMm),
      canvas.width,
      sliceCanvas.height,
      0,
      0,
      canvas.width,
      sliceCanvas.height,
    );

    pdf.addImage(
      sliceCanvas.toDataURL("image/png"),
      "PNG",
      MARGIN,
      HEADER_H + 2,
      contentW,
      sliceH,
    );

    // Footer — nomor halaman
    pdf.setTextColor("#9ca3af");
    pdf.setFontSize(7);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Halaman ${page + 1} dari ${totalPages}`, PAGE_W / 2, PAGE_H - 3, {
      align: "center",
    });
  }

  // ── Download ───────────────────────────────────────────────────────────────
  const safeName =
    fileName ?? `export-${now.toLocaleDateString("id-ID").replace(/\//g, "-")}`;
  pdf.save(`${safeName}.pdf`);
}
