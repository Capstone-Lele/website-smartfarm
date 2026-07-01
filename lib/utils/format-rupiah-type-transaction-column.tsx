import React from "react";
import { formatRupiah } from "./format-rupiah";

export function formatRupiahTypeTransactionColumn(
  price: string | number | null | undefined,
  transactionType: string | null | undefined
) {
  if (transactionType === "grant") {
    return (
      <div>
        {formatRupiah(price ? Number(price) : 0)}
        <span className="text-xs text-muted-foreground ml-2">
          (perkiraan)
        </span>
      </div>
    );
  }
  return price !== null && price !== undefined
    ? formatRupiah(Number(price))
    : "-";
}
