import {
  getFinancingApplications,
  setFinancingApplicationDecision,
} from "@/api/financing-applications.api";
import {
  FinancingDecisionModal,
  type DecisionModalAction,
} from "@/components/financing-decision-modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DecisionStatus } from "@/lib/financing-decisions";
import {
  formatCurrencyEur,
  formatFinancingRequestStatus,
  formatFinancingRequestType,
  riskStyles,
  statusStyles,
} from "@/lib/financing-display";
import type {
  FinancingApplication,
  RiskBucket,
} from "@/types/financing-applications";
import { Info } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

type RequestTableRow = FinancingApplication & {
  readonly documentCount: number;
};

type SortDirection = "none" | "asc" | "desc";

type DecisionModalState = {
  open: boolean;
  action: DecisionModalAction;
  requestId: string;
  companyName: string;
};

const riskRank: Record<RiskBucket, number> = {
  low: 1,
  medium: 2,
  high: 3,
};

function getNextSort(direction: SortDirection): SortDirection {
  if (direction === "none") {
    return "desc";
  }

  if (direction === "desc") {
    return "asc";
  }

  return "none";
}

export default function FinancingApplications() {
  const [data, setData] = useState<FinancingApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [decisionSubmitting, setDecisionSubmitting] = useState(false);
  const [decisionModal, setDecisionModal] = useState<DecisionModalState>({
    open: false,
    action: "approve",
    requestId: "",
    companyName: "",
  });
  const [scoreSort, setScoreSort] = useState<SortDirection>("none");
  const [riskSort, setRiskSort] = useState<SortDirection>("none");

  const rows: RequestTableRow[] = data.map((application) => ({
    ...application,
    documentCount: application.documents.length,
  }));

  const sortedRows = useMemo(() => {
    const currentRows = [...rows];

    if (scoreSort !== "none") {
      currentRows.sort((a, b) => {
        const delta = a.score.global_score - b.score.global_score;
        return scoreSort === "asc" ? delta : -delta;
      });
      return currentRows;
    }

    if (riskSort !== "none") {
      currentRows.sort((a, b) => {
        const delta =
          riskRank[a.score.risk_bucket] - riskRank[b.score.risk_bucket];
        return riskSort === "asc" ? delta : -delta;
      });
      return currentRows;
    }

    return currentRows;
  }, [rows, riskSort, scoreSort]);

  const scoreSortIndicator =
    scoreSort === "asc" ? "↑" : scoreSort === "desc" ? "↓" : "↕";

  const riskSortIndicator =
    riskSort === "asc" ? "↑" : riskSort === "desc" ? "↓" : "↕";

  useEffect(() => {
    let mounted = true;

    getFinancingApplications()
      .then((applications) => {
        if (mounted) {
          setData(applications);
        }
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  function openDecisionModal(
    action: DecisionModalAction,
    application: FinancingApplication,
  ): void {
    setDecisionModal({
      open: true,
      action,
      requestId: application.financing_request.id,
      companyName: application.company.name,
    });
  }

  function closeDecisionModal(): void {
    setDecisionModal((current) => ({ ...current, open: false }));
  }

  async function handleDecisionConfirm(payload: {
    rejectedReason: string | null;
  }): Promise<void> {
    const nextStatus: DecisionStatus =
      decisionModal.action === "approve" ? "approved" : "rejected";

    setDecisionSubmitting(true);

    try {
      await setFinancingApplicationDecision(decisionModal.requestId, {
        status: nextStatus,
        rejectedReason: payload.rejectedReason,
      });

      setData((currentData) =>
        currentData.map((application) => {
          if (application.financing_request.id !== decisionModal.requestId) {
            return application;
          }

          return {
            ...application,
            financing_request: {
              ...application.financing_request,
              status: nextStatus,
              rejectedReason: payload.rejectedReason,
            }
          };
        }),
      );

      closeDecisionModal();
    } finally {
      setDecisionSubmitting(false);
    }
  }

  return (
    <TooltipProvider>
      <div className="w-full space-y-6 px-6 py-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold tracking-tight">
            Demandes de financement
          </h1>
          <p className="text-sm text-muted-foreground">
            Toutes les demandes renvoyees par le systeme automatique de
            pre-evaluation de risque.
          </p>
        </div>

        <Card className="overflow-hidden border-border/60 shadow-sm">
          <CardHeader>
            <CardTitle>Gestion des demandes</CardTitle>
            <CardDescription>
              Gerer toutes les demandes de financement et visualiser les
              informations cles associees a chaque demande.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Societe</TableHead>
                  <TableHead>Demande</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto px-0 font-semibold"
                      onClick={() => {
                        setScoreSort((previous) => getNextSort(previous));
                        setRiskSort("none");
                      }}
                    >
                      Score {scoreSortIndicator}
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-auto px-0 font-semibold"
                      onClick={() => {
                        setRiskSort((previous) => getNextSort(previous));
                        setScoreSort("none");
                      }}
                    >
                      Risque {riskSortIndicator}
                    </Button>
                  </TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Documents fournis</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Chargement des donnees...
                    </TableCell>
                  </TableRow>
                ) : data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-8 text-center text-muted-foreground"
                    >
                      Aucune demande disponible.
                    </TableCell>
                  </TableRow>
                ) : (
                  sortedRows.map((application) => (
                    <TableRow key={application.financing_request.id}>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {application.company.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {application.company.businessType} ·{" "}
                            {application.company.legalCategory}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {formatFinancingRequestType(
                              application.financing_request.type,
                            )}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {application.financing_request.fundUsage}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatCurrencyEur(
                          application.financing_request.amount,
                        )}
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Badge variant="outline">
                              {application.score.global_score}/100
                            </Badge>
                          </TooltipTrigger>
                          <TooltipContent>
                            Score lie a la demande{" "}
                            {application.score.financing_request_id}
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                      <TableCell>
                        <Badge
                          className={riskStyles[application.score.risk_bucket]}
                          variant="outline"
                        >
                          {application.score.risk_bucket}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {application.financing_request.status === "rejected" &&
                        application.financing_request.rejectedReason ? (
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="inline-flex items-center gap-1.5 cursor-help">
                                <Badge
                                  className={
                                    statusStyles[
                                      application.financing_request.status
                                    ]
                                  }
                                  variant="outline"
                                >
                                  {formatFinancingRequestStatus(
                                    application.financing_request.status,
                                  )}
                                </Badge>
                                <Info className="h-3.5 w-3.5 text-muted-foreground" />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              Motif:{" "}
                              {application.financing_request.rejectedReason}
                            </TooltipContent>
                          </Tooltip>
                        ) : (
                          <Badge
                            className={
                              statusStyles[application.financing_request.status]
                            }
                            variant="outline"
                          >
                            {formatFinancingRequestStatus(
                              application.financing_request.status,
                            )}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>{application.documentCount}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {application.financing_request.status ===
                          "pending_review" ? (
                            <>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() =>
                                  openDecisionModal("approve", application)
                                }
                              >
                                Approuver
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  openDecisionModal("reject", application)
                                }
                              >
                                Refuser
                              </Button>
                            </>
                          ) : null}
                          <Button asChild size="sm" variant="outline">
                            <Link
                              to={`/financing-applications/${application.financing_request.id}`}
                            >
                              Ouvrir
                            </Link>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <FinancingDecisionModal
          open={decisionModal.open}
          action={decisionModal.action}
          requestId={decisionModal.requestId}
          companyName={decisionModal.companyName}
          submitting={decisionSubmitting}
          onClose={closeDecisionModal}
          onConfirm={handleDecisionConfirm}
        />
      </div>
    </TooltipProvider>
  );
}
