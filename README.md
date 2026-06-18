# Karmen Case Study

POC afin de gérer les demandes de financement avec une interface pour les analystes financiers.

## 🎯 Vue d'ensemble

Ce projet est un POC comprenant:

- **Backend**: API REST avec NestJS / Typescript avec des données mockées JSON
- **Frontend**: Interface React / Vite & Typescript
- **API Protection**: Gestion centralisée des URLs avec validation
- **Orchestration**: Scripts NPM pour démarrer toute la stack en une commande

## 🏗️ Architecture

### Backend (NestJS)

- **Port**: 3000
- **Framework**: NestJS 11 + TypeScript 5.7
- **Modules**:
  - `FinancingApplicationsModule`: Gestion des demandes de financement avec endpoints CRUD
  - `ConversationsModule`: Système de messages entre analystes et clients
- **Données**: Mock data intégrée
- **CORS**: Configuré pour localhost:5173 (frontend)

### Frontend (React)

- **Port**: 5173
- **Framework**: React 19 + Vite 8 + TypeScript 6.0
- **UI**: shadcn/ui + Tailwind CSS 4
- **Pages**:
  - `/dashboard`: Tableau de bord avec KPIs
  - `/demandes`: Liste des demandes avec tri et actions rapides
  - `/demandes/:id`: Détail d'une demande avec onglets (Synthèse + Conversation)
- **Proxy API**: Configuration Vite pour router `/api/*` vers le backend

## ✨ Fonctionnalités

### Système de Décisions

- Approbation/Rejet des demandes de financement
- Capture optionnelle de raison de rejet
- Persistance des décisions en localStorage (mock mode)
- État synchronisé avec l'interface
  
### Système de Conversations

- Conversation par demande de financement
- Messages bidirectionnels (analyste ↔ client)
- Statut de conversation (ouvert/fermé)
- Affichage en temps réel dans les onglets

### Sécurité

- **Gestion centralisée des URLs**: `src/lib/api-url.ts`
- **Validation des segments de chemin**: `encodeApiPathSegment()`
- **Vérification HTTPS en production**: Enforcement automatique
- **Absence d'URLs en dur**: Toutes les URLs sont construites via `apiUrl()`

## 🚀 Démarrage Rapide

### Prérequis

- Node.js 20+
- npm 10+

### Installation du projet

```bash
npm run install:all
```

### Lancer toute la stack

```bash
npm run start:all
```

Cela va démarrer en parallèle:

- **Backend** sur http://localhost:3000
- **Frontend** sur http://localhost:5173

Vous verrez les logs INFO pour chaque service:

```
[INFO] Demarrage du backend (http://localhost:3000)
[INFO] Demarrage du frontend (http://localhost:5173)
```

### Démarrer les services séparément

**Backend uniquement:**

```bash
npm --prefix backend run start:dev
```

**Frontend uniquement:**

```bash
npm --prefix frontend run dev
```

## 📁 Structure du Projet

```
karmen-case-study/
├── backend/                    # API NestJS
│   ├── src/
│   │   ├── app.module.ts
│   │   ├── main.ts            # Bootstrap avec CORS
│   │   ├── financing-applications/
│   │   │   ├── controller.ts  # Endpoints REST
│   │   │   ├── service.ts     # Logique métier
│   │   │   ├── module.ts
│   │   │   ├── models/        # Types TypeScript
│   │   │   └── data/          # Mock data
│   │   └── conversations/
│   │       ├── controller.ts  # Endpoints messaging
│   │       ├── service.ts     # Logique de messages
│   │       └── module.ts
│   ├── package.json
│   └── tsconfig.json
│
├── frontend/                   # Interface React
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx   # Tableau de bord KPIs
│   │   │   ├── Demandes.tsx    # Liste avec tri/actions
│   │   │   └── DemandeDetail.tsx # Détail + onglets
│   │   ├── api/                # Clients API
│   │   │   ├── financing-applications.api.ts
│   │   │   └── conversations.api.ts
│   │   ├── components/         # Composants réutilisables
│   │   ├── lib/
│   │   │   ├── api-url.ts      # URL builder centralisé
│   │   │   ├── financing-display.ts # Formatage
│   │   │   └── financing-decisions.ts # localStorage overlay
│   │   └── main.tsx
│   ├── vite.config.ts          # Proxy API config
│   ├── .env.local              # Config locale
│   ├── .env.example            # Template
│   └── package.json
│
└── package.json                # Orchestration root
```

## 🔧 Configuration

### Variables d'environnement (Frontend)

**`.env.local`** (création automatique):

```
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:3000
```

- `VITE_API_BASE_URL`: Base URL pour les appels API (dev: `/api`, production: `https://api.domain.com`)
- `VITE_API_PROXY_TARGET`: URL du backend pour le proxy Vite en développement

Voir `.env.example` pour la documentation complète.

## 📚 Endpoints API

### Financing Applications

```
GET    /financing-applications      # Liste toutes les demandes
GET    /financing-applications/:id  # Détail d'une demande
```

### Conversations

```
GET    /conversations/:financingRequestId              # Récupère la conversation
POST   /conversations/:financingRequestId/messages     # Ajoute un message
PATCH  /conversations/:financingRequestId/status      # Change le statut
```
