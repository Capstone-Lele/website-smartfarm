"use client";

import { ButtonCopy } from "@/components/button-copy";
import ButtonRedirectColumn from "@/components/button-column/button-redirect-column";
import DefaultCard from "@/components/card/default-card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { FinanceBySourceId } from "@/types/finance/finance";
import { LuArrowLeftRight, LuRepeat2 } from "react-icons/lu";

type ReversalFinanceRecord = FinanceBySourceId & {
  referenceTransactionSourceId?: string | null;
  reversedBySourceId?: string | null;
  reversalSourceId?: string | null;
  reversalSourceLabel?: string | null;
};

type ReversalTransactionCardProps = {
  financeRecord: ReversalFinanceRecord | null;
  sourceType: string;
  descriptionLabel: string;
};

const ReversalTransactionCard = ({
  financeRecord,
  sourceType,
  descriptionLabel,
}: ReversalTransactionCardProps) => {
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

  const buildFinanceHref = (sourceId: string) =>
    `/dashboard/finance/${sourceId}?type=${sourceType}`;

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
              {descriptionLabel} ini sudah pernah dilakukan transaksi reversal.
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
                  <ButtonRedirectColumn href={buildFinanceHref(reversalNoteId)} />
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
                    href={buildFinanceHref(referenceSourceId)}
                  />
                </div>
              )}
            </div>
          </div>
        </DefaultCard>
      )}
    </>
  );
};

export type { ReversalFinanceRecord };
export default ReversalTransactionCard;
