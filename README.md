# pipeline-demo

![CI/CD Pipeline](https://github.com/morikumo/pipeline-demo/actions/workflows/ci-cd.yml/badge.svg)
[![Statut Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=morikumo_pipeline-demo&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=morikumo_pipeline-demo)
[![Couverture](https://sonarcloud.io/api/project_badges/measure?project=morikumo_pipeline-demo&metric=coverage)](https://sonarcloud.io/summary/new_code?id=morikumo_pipeline-demo)

Un pipeline CI/CD complet, conçu avec **GitHub Actions**, **Docker**, **SonarCloud** et **Trivy**. Ce projet illustre les bonnes pratiques DevSecOps appliquées à une API Node.js/Express minimaliste.

---

## 🏗️ Architecture du pipeline

```
Push sur main / Pull Request
        │
        ▼
┌───────────────────┐
│  🧪 Test & Sonar  │  ← Tests Jest + couverture + quality gate SonarCloud
└────────┬──────────┘
         │ (si succès)
         ▼
┌───────────────────┐
│  🐳 Build Docker  │  ← Build multi-stage → push sur GHCR
└────────┬──────────┘
         │ (si succès)
         ▼
┌───────────────────┐
│  🔒 Scan Trivy    │  ← Scan CVE CRITICAL/HIGH sur l'image
└────────┬──────────┘
         │ (si succès, main uniquement)
         ▼
┌───────────────────┐
│  🚀 Prêt à déployer│  ← Résumé + référence de l'image
└───────────────────┘
```

---

## 🛠️ Stack technique

| Outil | Rôle |
|---|---|
| **Node.js + Express** | Application web minimaliste |
| **Jest + Supertest** | Tests unitaires et couverture de code |
| **GitHub Actions** | Orchestration du pipeline CI/CD |
| **Docker (multi-stage)** | Containerisation optimisée |
| **GHCR** | Registry d'images (gratuit, intégré à GitHub) |
| **SonarCloud** | Analyse qualité du code + quality gate |
| **Trivy** | Scan de vulnérabilités CVE sur l'image Docker |

---

## 📁 Structure du projet

```
pipeline-demo/
├── app/
│   ├── index.js            # API Express (/, /health, /greet/:name)
│   ├── index.test.js       # Tests Jest
│   └── package.json
├── Dockerfile              # Build multi-stage (deps + final)
├── .dockerignore
├── .github/
│   └── workflows/
│       └── ci-cd.yml       # Pipeline GitHub Actions
├── sonar-project.properties
└── README.md
```

---

## 🚀 Lancer le projet

### En local

```bash
cd app
npm install
npm start
# → http://localhost:3000
```

### Lancer les tests

```bash
cd app
npm test
```

### Build et run avec Docker

```bash
docker build -t pipeline-demo .
docker run -p 3000:3000 pipeline-demo
```

### Télécharger l'image depuis GHCR

```bash
docker pull ghcr.io/morikumo/pipeline-demo:latest
docker run -p 3000:3000 ghcr.io/morikumo/pipeline-demo:latest
```

---

## ⚙️ Guide de configuration

### 1. Créer le repo sur GitHub

Le repo doit être **public** (requis pour SonarCloud gratuit).

### 2. Créer un compte SonarCloud

1. Aller sur [sonarcloud.io](https://sonarcloud.io) → **Se connecter avec GitHub**
2. Cliquer sur **+** → **Analyser un nouveau projet** → sélectionner ce repo
3. Choisir **GitHub Actions** comme méthode CI
4. Copier le `SONAR_TOKEN` fourni

### 3. Ajouter le secret GitHub

Dans le repo → **Settings → Secrets and variables → Actions → New repository secret** :

| Secret | Valeur |
|---|---|
| `SONAR_TOKEN` | Token copié depuis SonarCloud |

> `GITHUB_TOKEN` est fourni automatiquement par GitHub Actions, aucune configuration nécessaire.

### 4. Mettre à jour sonar-project.properties

Remplacer `morikumo` par ton nom d'utilisateur GitHub dans `sonar-project.properties`.

### 5. Pousser sur main → le pipeline se déclenche automatiquement ✅

---

## 🔒 Fonctionnalités de sécurité

- **Conteneur non-root** : l'application tourne sous un utilisateur dédié `appuser`
- **Build multi-stage** : aucun outil de développement dans l'image finale
- **Scan Trivy** : le pipeline échoue si une CVE CRITICAL ou HIGH est détectée
- **Upload SARIF** : les résultats Trivy sont visibles dans l'onglet **Security** de GitHub

---

## 📊 Endpoints de l'API

| Méthode | Endpoint | Description |
|---|---|---|
| GET | `/` | Statut de l'application |
| GET | `/health` | Vérification de santé |
| GET | `/greet/:name` | Retourne un message de salutation |

---

## 📄 Licence

MIT