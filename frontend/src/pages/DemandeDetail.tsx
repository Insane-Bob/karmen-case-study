import { useEffect, useMemo, useState } from "react";

import {
  createConversationMessage,
  getConversationByFinancingRequestId,
  updateConversationStatus,
} from "@/api/conversations.api";
import {
  getFinancingApplicationById,
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
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DecisionStatus } from "@/lib/financing-decisions";
import {
  formatCurrencyEur,
  formatDocumentType,
  formatFinancingRequestStatus,
  formatFinancingRequestType,
  riskStyles,
} from "@/lib/financing-display";
import type {
  ConversationWithMessages,
  MessageSenderType,
} from "@/types/conversations";
import type { FinancingApplication } from "@/types/financing-applications";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  ChevronLeft,
  ChevronRight,
  FileQuestion,
  FileText,
  Hash,
  MapPin,
  MessageSquare,
  Percent,
  Send,
  Tag,
  User,
  Wallet,
} from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

export default function DemandeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [application, setApplication] = useState<FinancingApplication | null>(
    null,
  );
  const [requestIds, setRequestIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [decisionSubmitting, setDecisionSubmitting] = useState(false);
  const [decisionAction, setDecisionAction] =
    useState<DecisionModalAction>("approve");
  const [decisionModalOpen, setDecisionModalOpen] = useState(false);

  const [conversation, setConversation] =
    useState<ConversationWithMessages | null>(null);
  const [conversationSubmitting, setConversationSubmitting] = useState(false);
  const [messageSenderType, setMessageSenderType] =
    useState<MessageSenderType>("analyst");
  const [messageContent, setMessageContent] = useState("");

  useEffect(() => {
    if (!id) {
      setError("Identifiant de demande invalide.");
      setLoading(false);
      return;
    }

    let mounted = true;

    Promise.all([
      getFinancingApplicationById(id),
      getFinancingApplications(),
      getConversationByFinancingRequestId(id),
    ])
      .then(([result, requests, currentConversation]) => {
        if (!mounted) {
          return;
        }

        setApplication(result);
        setRequestIds(requests.map((request) => request.financing_request.id));
        setConversation(currentConversation);
      })
      .catch((caughtError: unknown) => {
        if (!mounted) {
          return;
        }

        const message =
          caughtError instanceof Error
            ? caughtError.message
            : "Une erreur est survenue pendant le chargement.";
        setError(message);
      })
      .finally(() => {
        if (mounted) {
          setLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, [id]);

  const currentIndex = useMemo(() => {
    if (!id) {
      return -1;
    }

    return requestIds.indexOf(id);
  }, [id, requestIds]);

  const previousRequestId =
    currentIndex > 0 ? requestIds[currentIndex - 1] : undefined;

  const nextRequestId =
    currentIndex >= 0 && currentIndex < requestIds.length - 1
      ? requestIds[currentIndex + 1]
      : undefined;

  const isClientActionRequired = conversation?.status === "open";

  async function toggleConversationStatus(nextStatus: "open" | "closed") {
    if (!application) {
      return;
    }

    setConversationSubmitting(true);

    try {
      const updatedConversation = await updateConversationStatus(
        application.financing_request.id,
        nextStatus,
      );
      setConversation(updatedConversation);
    } finally {
      setConversationSubmitting(false);
    }
  }

  async function sendMessage(): Promise<void> {
    if (!application) {
      return;
    }

    const content = messageContent.trim();
    if (content.length === 0) {
      return;
    }

    setConversationSubmitting(true);

    try {
      const updatedConversation = await createConversationMessage(
        application.financing_request.id,
        {
          senderType: messageSenderType,
          content,
        },
      );
      setConversation(updatedConversation);
      setMessageContent("");
    } finally {
      setConversationSubmitting(false);
    }
  }

  async function handleDecisionConfirm(payload: {
    rejectedReason: string | null;
  }): Promise<void> {
    if (!application) {
      return;
    }

    const nextStatus: DecisionStatus =
      decisionAction === "approve" ? "approved" : "rejected";

    setDecisionSubmitting(true);

    try {
      await setFinancingApplicationDecision(application.financing_request.id, {
        status: nextStatus,
        rejectedReason: payload.rejectedReason,
      });

      setApplication((current) => {
        if (!current) {
          return current;
        }

        return {
          ...current,
          financing_request: {
            ...current.financing_request,
            status: nextStatus,
            rejectedReason: payload.rejectedReason,
          },
        };
      });

      setDecisionModalOpen(false);
    } finally {
      setDecisionSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="w-full space-y-6 px-6 py-6 lg:px-10">
        <div className="flex items-center justify-between">
          <div className="h-8 w-44 animate-pulse rounded-md bg-muted" />
          <div className="h-8 w-28 animate-pulse rounded-md bg-muted" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-40 animate-pulse rounded bg-muted" />
          <div className="h-8 w-72 animate-pulse rounded bg-muted" />
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="space-y-2 bg-card p-4">
              <div className="h-3 w-16 animate-pulse rounded bg-muted" />
              <div className="h-6 w-20 animate-pulse rounded bg-muted" />
            </div>
          ))}
        </div>
        <div className="h-40 animate-pulse rounded-lg border bg-card" />
        <div className="h-40 animate-pulse rounded-lg border bg-card" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full space-y-4 px-6 py-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <CardTitle>Impossible de charger la demande</CardTitle>
            </div>
            <CardDescription>{error}</CardDescription>
          </CardHeader>
        </Card>
        <Button asChild variant="outline">
          <Link to="/demandes">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Retour aux demandes
          </Link>
        </Button>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="w-full space-y-4 px-6 py-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileQuestion className="h-5 w-5 text-muted-foreground" />
              <CardTitle>Demande introuvable</CardTitle>
            </div>
            <CardDescription>
              Aucune demande ne correspond à cet identifiant.
            </CardDescription>
          </CardHeader>
        </Card>
        <Button asChild variant="outline">
          <Link to="/demandes">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Retour aux demandes
          </Link>
        </Button>
      </div>
    );
  }

  const { financing_request, company, score, documents } = application;

  return (
    <div className="w-full space-y-6 px-6 py-6 lg:px-10">
      <div className="flex items-center justify-between">
        <Button
          asChild
          variant="ghost"
          size="sm"
          className="-ml-2 text-muted-foreground hover:text-foreground"
        >
          <Link to="/demandes">
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Retour aux demandes
          </Link>
        </Button>

        <div className="flex items-center gap-1 rounded-lg border bg-card p-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={!previousRequestId}
            onClick={() => {
              if (previousRequestId) {
                navigate(`/demandes/${previousRequestId}`);
              }
            }}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[3.5rem] px-1 text-center text-xs tabular-nums text-muted-foreground">
            {currentIndex >= 0 && requestIds.length > 0
              ? `${currentIndex + 1} / ${requestIds.length}`
              : "-"}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={!nextRequestId}
            onClick={() => {
              if (nextRequestId) {
                navigate(`/demandes/${nextRequestId}`);
              }
            }}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {financing_request.status === "pending_review" ? (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            size="sm"
            onClick={() => {
              setDecisionAction("approve");
              setDecisionModalOpen(true);
            }}
          >
            Approuver
          </Button>
          <Button
            type="button"
            size="sm"
            variant="destructive"
            onClick={() => {
              setDecisionAction("reject");
              setDecisionModalOpen(true);
            }}
          >
            Refuser
          </Button>
        </div>
      ) : null}

      <Tabs defaultValue="synthese" className="w-full">
        <TabsList>
          <TabsTrigger value="synthese">Synthese demande</TabsTrigger>
          <TabsTrigger value="conversation">Conversation</TabsTrigger>
        </TabsList>

        <TabsContent value="synthese" className="space-y-6 pt-2">
          <div className="space-y-1.5">
            <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Demande {financing_request.id}
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-semibold tracking-tight">
                {company.name}
              </h1>
              <Badge variant="secondary" className="font-normal">
                {formatFinancingRequestStatus(financing_request.status)}
              </Badge>
            </div>
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" />
              {company.businessType} · SIREN {company.siren}
            </p>
          </div>

          {financing_request.status === "rejected" &&
          financing_request.rejectedReason ? (
            <Card className="border-destructive/30 bg-destructive/5">
              <CardHeader>
                <CardTitle className="text-base">Motif du refus</CardTitle>
                <CardDescription>
                  Cette justification a ete saisie lors de la decision.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed">
                  {financing_request.rejectedReason}
                </p>
              </CardContent>
            </Card>
          ) : null}

          <Card className="overflow-hidden p-0">
            <div className="grid grid-cols-2 divide-y sm:grid-cols-4 sm:divide-x sm:divide-y-0">
              <KpiCell
                icon={Wallet}
                label="Montant"
                value={formatCurrencyEur(financing_request.amount)}
              />
              <KpiCell
                icon={Calendar}
                label="Duree"
                value={`${financing_request.durationInMonth} mois`}
              />
              <KpiCell
                icon={Percent}
                label="Taux"
                value={`${financing_request.interestRate.toFixed(1)} %`}
              />
              <KpiCell
                icon={Tag}
                label="Type"
                value={formatFinancingRequestType(financing_request.type)}
              />
            </div>
          </Card>

          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Usage des fonds</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="border-l-2 border-primary/30 pl-4 text-sm leading-relaxed text-foreground/90">
                  {financing_request.fundUsage}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">
                  Evaluation du risque
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center gap-3 pt-2">
                <ScoreGauge
                  score={score.global_score}
                  riskBucket={score.risk_bucket}
                />
                <Badge
                  className={riskStyles[score.risk_bucket]}
                  variant="outline"
                >
                  {score.risk_bucket}
                </Badge>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Societe</CardTitle>
                <CardDescription>
                  Donnees legales et operationnelles.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  <InfoRow icon={Building2} label="Nom" value={company.name} />
                  <InfoRow icon={Hash} label="SIREN" value={company.siren} />
                  <InfoRow
                    icon={Briefcase}
                    label="Activite"
                    value={company.businessType}
                  />
                  <InfoRow
                    icon={Tag}
                    label="Categorie"
                    value={company.legalCategory}
                  />
                  <InfoRow
                    icon={MapPin}
                    label="Adresse"
                    value={`${company.address}, ${company.postalCode}`}
                  />
                  <InfoRow
                    icon={User}
                    label="Dirigeant"
                    value={company.owner}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Documents associes</CardTitle>
                <CardDescription>
                  {documents.length} document(s) lies a cette demande.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {documents.length === 0 ? (
                  <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed py-8 text-center">
                    <FileQuestion className="h-6 w-6 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Aucun document n'a encore ete depose pour cette demande.
                    </p>
                  </div>
                ) : (
                  <div className="grid gap-3 sm:grid-cols-2">
                    {documents.map((document) => (
                      <div
                        key={document.id}
                        className="flex items-center gap-3 rounded-lg border p-3 transition-colors hover:border-primary/40 hover:bg-accent/40"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium">
                            {document.name}
                          </p>
                          <p className="text-xs capitalize text-muted-foreground">
                            {formatDocumentType(document.type)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="conversation" className="pt-2">
          <Card>
            <CardHeader className="flex flex-row items-start justify-between gap-3">
              <div>
                <CardTitle className="flex items-center gap-2 text-base">
                  <MessageSquare className="h-4 w-4" />
                  Conversation Analyste / Client
                </CardTitle>
                <CardDescription>
                  Echanges pour demander des pieces ou informations
                  complementaires au client.
                </CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={isClientActionRequired ? "default" : "secondary"}
                >
                  {isClientActionRequired
                    ? "Action client requise"
                    : "Action client non requise"}
                </Badge>
                <Button
                  type="button"
                  size="sm"
                  variant={isClientActionRequired ? "outline" : "default"}
                  disabled={conversationSubmitting}
                  onClick={() =>
                    void toggleConversationStatus(
                      isClientActionRequired ? "closed" : "open",
                    )
                  }
                >
                  {isClientActionRequired
                    ? "Clore la conversation"
                    : "Demander action client"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="max-h-64 space-y-3 overflow-y-auto rounded-md border p-3">
                {conversation && conversation.messages.length > 0 ? (
                  conversation.messages.map((message) => {
                    const isAnalyst = message.senderType === "analyst";

                    return (
                      <div
                        key={message.id}
                        className={`flex ${isAnalyst ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                            isAnalyst
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted text-foreground"
                          }`}
                        >
                          <p className="text-[11px] font-medium opacity-80">
                            {isAnalyst ? "Analyste" : "Client"}
                          </p>
                          <p>{message.content}</p>
                          <p className="mt-1 text-[10px] opacity-70">
                            {new Date(message.createdAt).toLocaleString(
                              "fr-FR",
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Aucun message pour le moment.
                  </p>
                )}
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    size="sm"
                    variant={
                      messageSenderType === "analyst" ? "default" : "outline"
                    }
                    onClick={() => setMessageSenderType("analyst")}
                  >
                    Analyste
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={
                      messageSenderType === "client" ? "default" : "outline"
                    }
                    onClick={() => setMessageSenderType("client")}
                  >
                    Client
                  </Button>
                </div>
                <div className="flex items-center gap-2">
                  <Input
                    value={messageContent}
                    placeholder="Ecrire un message..."
                    onChange={(event) => setMessageContent(event.target.value)}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        event.preventDefault();
                        void sendMessage();
                      }
                    }}
                    disabled={conversationSubmitting || !isClientActionRequired}
                  />
                  <Button
                    type="button"
                    disabled={conversationSubmitting || !isClientActionRequired}
                    onClick={() => void sendMessage()}
                  >
                    <Send className="h-4 w-4" />
                    Envoyer
                  </Button>
                </div>
                {!isClientActionRequired ? (
                  <p className="text-xs text-muted-foreground">
                    Ouvrez la conversation avec "Demander action client" pour
                    envoyer des messages.
                  </p>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <FinancingDecisionModal
        open={decisionModalOpen}
        action={decisionAction}
        requestId={financing_request.id}
        companyName={company.name}
        submitting={decisionSubmitting}
        onClose={() => setDecisionModalOpen(false)}
        onConfirm={handleDecisionConfirm}
      />
    </div>
  );
}

function KpiCell({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col gap-1.5 bg-card p-4">
      <div className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <p className="text-xl font-semibold tracking-tight tabular-nums">
        {value}
      </p>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-muted text-muted-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-medium capitalize">{value}</p>
      </div>
    </div>
  );
}

function getRiskColor(riskBucket: string): string {
  const key = riskBucket?.toLowerCase() ?? "";
  if (key.includes("faible") || key.includes("low")) return "#16a34a";
  if (
    key.includes("moyen") ||
    key.includes("medium") ||
    key.includes("moder")
  ) {
    return "#d97706";
  }
  if (key.includes("elev") || key.includes("high")) return "#dc2626";
  return "#64748b";
}

function ScoreGauge({
  score,
  riskBucket,
}: {
  score: number;
  riskBucket: string;
}) {
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100) / 100;
  const offset = circumference * (1 - progress);
  const ringColor = getRiskColor(riskBucket);

  return (
    <div className="relative flex h-32 w-32 items-center justify-center">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="9"
          className="text-muted"
        />
        <circle
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={ringColor}
          strokeWidth="9"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="text-2xl font-semibold tracking-tight tabular-nums">
          {score}
        </span>
        <span className="text-[11px] text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

