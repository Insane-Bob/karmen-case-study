import { useEffect, useMemo, useState } from "react";

import { getFinancingApplications } from "@/api/financing-applications.api";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type {
  FinancingApplication,
  RiskBucket,
} from "@/types/financing-applications";

type DashboardKpi = {
  label: string;
  value: string;
  description: string;
  accent: string;
};

type RiskSummary = Record<RiskBucket, number>;

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

  const kpis: DashboardKpi[] = [
    {
      label: "Total dossiers",
      value: loading ? "..." : `${summary.totalApplications}`,
      description: "Demandes actuellement disponibles",
      accent: "from-emerald-500/15 to-emerald-500/5",
    },
    {
      label: "Montant total",
      value: loading
        ? "..."
        : `${summary.totalAmount.toLocaleString("fr-FR")} €`,
      description: "Montants demandés sur tous les dossiers.",
      accent: "from-sky-500/15 to-sky-500/5",
    },
    {
      label: "Score moyen",
      value: loading ? "..." : `${summary.averageScore}/100`,
      description: "Moyenne des scores globaux des dossiers.",
      accent: "from-violet-500/15 to-violet-500/5",
    },
    {
      label: "Risque faible",
      value: loading ? "..." : `${riskCounts.low}`,
      description: "Nombre de dossiers avec un risque faible.",
      accent: "from-emerald-500/15 to-emerald-500/5",
    },
    {
      label: "Risque moyen",
      value: loading ? "..." : `${riskCounts.medium}`,
      description: "Nombre de dossiers avec un risque moyen.",
      accent: "from-amber-500/15 to-amber-500/5",
    },
    {
      label: "Risque élevé",
      value: loading ? "..." : `${riskCounts.high}`,
      description: "Nombre de dossiers avec un risque élevé.",
      accent: "from-rose-500/15 to-rose-500/5",
    },
  ];

  return (
    <div className="w-full space-y-6 px-6 py-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-semibold tracking-tight">
          Dashboard analyste
        </h1>
        <p className="text-sm text-muted-foreground">
          Indicateurs clés consolidés à partir des demandes de financement.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {kpis.map((kpi) => (
          <Card
            key={kpi.label}
            className="overflow-hidden border-border/60 shadow-sm"
          >
            <div className={`h-1 bg-gradient-to-r ${kpi.accent}`} />
            <CardHeader className="gap-1">
              <CardDescription>{kpi.label}</CardDescription>
              <CardTitle className="text-2xl">{kpi.value}</CardTitle>
              <p className="text-sm text-muted-foreground">{kpi.description}</p>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}
