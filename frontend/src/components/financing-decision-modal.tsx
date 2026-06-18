import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

export type DecisionModalAction = "approve" | "reject";

type FinancingDecisionModalProps = {
  open: boolean;
  action: DecisionModalAction;
  requestId: string;
  companyName: string;
  submitting: boolean;
  onClose: () => void;
  onConfirm: (payload: { rejectedReason: string | null }) => Promise<void>;
};

export function FinancingDecisionModal({
  open,
  action,
  requestId,
  companyName,
  submitting,
  onClose,
  onConfirm,
}: FinancingDecisionModalProps) {
  const [rejectedReason, setRejectedReason] = useState("");

  useEffect(() => {
    if (open) {
      setRejectedReason("");
    }
  }, [action, open]);

  if (!open) {
    return null;
  }

  const isReject = action === "reject";
  const title = isReject ? "Refuser la demande" : "Approuver la demande";
  const confirmLabel = isReject
    ? "Confirmer le refus"
    : "Confirmer l'approbation";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-lg rounded-xl border bg-background p-5 shadow-xl">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold">{title}</h2>
          <p className="text-sm text-muted-foreground">
            Demande {requestId} pour {companyName}
          </p>
        </div>

        {isReject ? (
          <div className="mt-4 space-y-2">
            <label htmlFor="rejected-reason" className="text-sm font-medium">
              Motif du refus
            </label>
            <textarea
              id="rejected-reason"
              value={rejectedReason}
              onChange={(event) => setRejectedReason(event.target.value)}
              placeholder="Exemple: dossier incomplet, risque trop eleve..."
              className="min-h-28 w-full rounded-md border bg-background px-3 py-2 text-sm outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring"
            />
          </div>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">
            Cette action passera la demande au statut approuvee.
          </p>
        )}

        <div className="mt-5 flex items-center justify-end gap-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={submitting}
          >
            Annuler
          </Button>
          <Button
            type="button"
            variant={isReject ? "destructive" : "default"}
            disabled={
              submitting || (isReject && rejectedReason.trim().length === 0)
            }
            onClick={() =>
              void onConfirm({
                rejectedReason: isReject ? rejectedReason.trim() : null,
              })
            }
          >
            {submitting ? "En cours..." : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
