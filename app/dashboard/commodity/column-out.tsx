import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ButtonReversalColumn from "@/components/button-column/button-reversal-column";
import PopupReversal from "@/components/popup-reversal";
import { toast } from "sonner";
import { useState } from "react";
import { DataTableColumnHeader } from "@/components/data-table/column-header-sorting";
import { formatDate } from "@/lib/utils/format-date";
import { Commodity } from "@/types/comodity";
import { ColumnDef } from "@tanstack/react-table";
import ButtonDetailColumn from "@/components/button-column/button-detail-column";
import { ButtonCopy } from "@/components/button-copy";
import { useCreateTransactionReversalCommodity } from "@/lib/api/service/transaction-reversal/useTransactionReversal";

const CommodityOutActions = ({ row }: { row: any }) => {
  const [isReversalOpen, setIsReversalOpen] = useState(false);
  const createTransactionReversal = useCreateTransactionReversalCommodity(
    row.transactionId || "",
  );
  
  const canCreateReversal =
    row.type !== "reversal" &&
    !row.reversedBySourceId &&
    Boolean(row.transactionId);

  const handleReversal = async () => {
    try {
      await createTransactionReversal.mutateAsync();
      toast.success("Transaksi reversal berhasil dilakukan");
      setIsReversalOpen(false);
    } catch {
      toast.error("Gagal melakukan transaksi reversal", {
        description: "Silakan coba lagi.",
      });
    }
  };

  return (
    <div className="flex items-center text-primary gap-0.5">
      <ButtonDetailColumn href={`/dashboard/commodity/${row.id}`} />
      {canCreateReversal ? (
        <>
          <Separator orientation="vertical" className="h-6" />
          <ButtonReversalColumn
            disabled={createTransactionReversal.isPending}
            onClick={() => setIsReversalOpen(true)}
          />
          <PopupReversal
            title="Konfirmasi Reversal"
            message="Apakah Anda yakin ingin melakukan reversal transaksi ini? Aksi ini akan membuat transaksi pembalik."
            type="warning"
            isOpen={isReversalOpen}
            setOpen={setIsReversalOpen}
            isLoading={createTransactionReversal.isPending}
            onConfirm={handleReversal}
            onCancel={() => setIsReversalOpen(false)}
          />
        </>
      ) : row.type === "reversal" || row.reversedBySourceId ? (
        <>
          <Separator orientation="vertical" className="h-6" />
          <ButtonReversalColumn disabled={true} onClick={() => {}} />
        </>
      ) : null}
    </div>
  );
};

export const columns_out: ColumnDef<Commodity>[] = [
  {
    id: "date",
    accessorFn: (row) => formatDate(row.date),
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TANGGAL" />
    ),
    cell: ({ row }) => row.getValue("date"),
  },
  {
    id: "type",
    accessorFn: (row) => (row.type === "in" ? "Masuk" : row.type === "out" ? "Keluar" : "Reversal"),
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="TIPE" />
    ),
    cell: ({ row }) => {
      const type = row.original.type;
      return (
        <div
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
            type === "in"
              ? "bg-emerald-100 text-emerald-700"
              : type === "out"
              ? "bg-red-100 text-red-700"
              : "bg-blue-100 text-blue-700"
          }`}
        >
          {row.getValue("type")}
        </div>
      );
    },
  },
  {
    id: "category",
    accessorFn: () => "Penjualan",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="KATEGORI" />
    ),
    cell: ({ row }) => row.getValue("category"),
  },
  {
    accessorKey: "buyerName",
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="NAMA PEMBELI" />
    ),
  },
  {
    accessorKey: "quantity",
    header: ({ column }) => (
      <DataTableColumnHeader
        className=""
        column={column}
        title="TOTAL TERJUAL (ekor)"
      />
    ),
  },
  {
    id: "reversalSource",
    accessorFn: (row) => {
      const item = row as any;
      if (item.type === "reversal") {
        return item.referenceSourceId || "-";
      }
      return item.reversedBySourceId ? "Direversal" : "-";
    },
    header: ({ column }) => (
      <DataTableColumnHeader className="" column={column} title="REVERSAL" />
    ),
    cell: ({ row }) => {
      const item = row.original as any;

      if (item.type === "reversal") {
        return (
          <div className="flex flex-col space-y-0.5">
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              Dari data
            </Badge>
            {item.referenceSourceId ? (
              <ButtonCopy
                textToCopy={item.referenceSourceId}
                truncateLength={5}
              />
            ) : (
              <span className="text-muted-foreground">-</span>
            )}
          </div>
        );
      }

      if (item.reversedBySourceId) {
        return (
          <Badge variant="outline" className="text-orange-700 border-orange-200">
            Direversal
          </Badge>
        );
      }

      return <span className="text-muted-foreground">-</span>;
    },
  },
  {
    id: "actions",
    header: () => <span>ACTION</span>,
    cell: ({ row }) => <CommodityOutActions row={row.original} />,
  },
];
