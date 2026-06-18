import { useEffect, useMemo, useState } from "react";
import { Euro, FileStack, Gauge, ShieldAlert } from "lucide-react";

import { getFinancingApplications } from "@/api/financing-applications.api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type {
  FinancingApplication,
  RiskBucket,
} from "@/types/financing-applications";

type RiskSummary = Record<RiskBucket, number>;

type PrimaryKpi = {
  key: string;
  label: string;
  value: string;
  description: string;
  icon: typeof Euro;
  iconClassName: string;
};

const RISK_BUCKETS: RiskBucket[] = ["low", "medium", "high"];

const RISK_CONFIG: Record<
  RiskBucket,
  { label: string; dot: string; bar: string; text: string }
> = {
  low: {
    label: "Risque faible",
    dot: "bg-emerald-500",
    bar: "bg-emerald-500",
    text: "text-emerald-600",
  },
  medium: {
    label: "Risque moyen",
    dot: "bg-amber-500",
    bar: "bg-amber-500",
    text: "text-amber-600",
  },
  high: {
    label: "Risque élevé",
    dot: "bg-rose-500",
    bar: "bg-rose-500",
    text: "text-rose-600",
  },
};

function scoreTone(score: number) {
  if (score >= 70) return "bg-emerald-500/10 text-emerald-600";
  if (score >= 40) return "bg-amber-500/10 text-amber-600";
  return "bg-rose-500/10 text-rose-600";
}

export default function Dashboard() {
  const [data, setData] = useState<FinancingApplication[]>([]);
  const [loading, setLoading] = useState(true);

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

  const summary = useMemo(() => {
    const totalAmount = data.reduce(
      (sum, application) => sum + application.financing_request.amount,
      0,
    );

    return {
      totalApplications: data.length,
      totalAmount,
      averageScore:
        data.length === 0
          ? 0
          : Math.round(
              data.reduce(
                (sum, application) => sum + application.score.global_score,
                0,
              ) / data.length,
            ),
    };
  }, [data]);

  const riskCounts = useMemo(() => {
    return data.reduce(
      (accumulator, application) => {
        accumulator[application.score.risk_bucket] += 1;
        return accumulator;
      },
      { low: 0, medium: 0, high: 0 } satisfies RiskSummary,
    );
  }, [data]);

  const totalRisk = riskCounts.low + riskCounts.medium + riskCounts.high;

  const primaryKpis: PrimaryKpi[] = [
    {
      key: "total",
      label: "Total dossiers",
      value: `${summary.totalApplications}`,
      description: "Demandes actuellement disponibles",
      icon: FileStack,
      iconClassName: "bg-slate-500/10 text-slate-600",
    },
    {
      key: "amount",
      label: "Montant total",
      value: `${summary.totalAmount.toLocaleString("fr-FR")} €`,
      description: "Montants demandés sur tous les dossiers",
      icon: Euro,
      iconClassName: "bg-indigo-500/10 text-indigo-600",
    },
    {
      key: "score",
      label: "Score moyen",
      value: `${summary.averageScore}/100`,
      description: "Moyenne des scores globaux des dossiers",
      icon: Gauge,
      iconClassName: scoreTone(summary.averageScore),
    },
  ];

  return (
    <div className="w-full space-y-8 px-6 py-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-semibold tracking-tight">
          Dashboard analyste
        </h1>
        <p className="text-sm text-muted-foreground">
          Indicateurs clés consolidés à partir des demandes de financement.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {primaryKpis.map((kpi) => (
          <Card
            key={kpi.key}
            className="border-border/60 shadow-sm transition-shadow hover:shadow-md"
          >
            <CardContent className="flex items-start gap-4 p-6">
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  kpi.iconClassName,
                )}
              >
                <kpi.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 space-y-1">
                <CardDescription className="text-xs font-medium uppercase tracking-wide text-muted-foreground/80">
                  {kpi.label}
                </CardDescription>
                {loading ? (
                  <div className="h-8 w-24 animate-pulse rounded-md bg-muted" />
                ) : (
                  <CardTitle className="text-2xl tabular-nums">
                    {kpi.value}
                  </CardTitle>
                )}
                <p className="text-sm text-muted-foreground">
                  {kpi.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-border/60 shadow-sm">
        <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-500/10 text-slate-600">
            <ShieldAlert className="h-4 w-4" />
          </div>
          <div>
            <CardTitle className="text-base">
              Répartition des risques
            </CardTitle>
            <CardDescription>
              Niveau de risque des dossiers en cours
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
          ) : totalRisk === 0 ? (
            <p className="text-sm text-muted-foreground">
              Aucun dossier à afficher pour le moment.
            </p>
          ) : (
            <div className="flex h-3 w-full overflow-hidden rounded-full bg-muted">
              {RISK_BUCKETS.map((bucket) => {
                const percentage = (riskCounts[bucket] / totalRisk) * 100;
                if (percentage === 0) return null;
                return (
                  <div
                    key={bucket}
                    className={RISK_CONFIG[bucket].bar}
                    style={{ width: `${percentage}%` }}
                    title={`${RISK_CONFIG[bucket].label} : ${riskCounts[bucket]}`}
                  />
                );
              })}
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-3">
            {RISK_BUCKETS.map((bucket) => (
              <div
                key={bucket}
                className="flex items-center justify-between rounded-lg border border-border/60 px-4 py-3"
              >
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "h-2.5 w-2.5 rounded-full",
                      RISK_CONFIG[bucket].dot,
                    )}
                  />
                  <span className="text-sm text-muted-foreground">
                    {RISK_CONFIG[bucket].label}
                  </span>
                </div>
                <span
                  className={cn(
                    "text-lg font-semibold tabular-nums",
                    RISK_CONFIG[bucket].text,
                  )}
                >
                  {loading ? "–" : riskCounts[bucket]}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}