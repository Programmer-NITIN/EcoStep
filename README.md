# 🌱 Carbon Footprint Awareness Platform

[![CI](https://github.com/nitinpatidar/Virtual-Prompt-was-Week-3/actions/workflows/ci.yml/badge.svg)](https://github.com/nitinpatidar/Virtual-Prompt-was-Week-3/actions/workflows/ci.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **Virtual PromptWars — Challenge 3.** A comprehensive, accessible web application designed to help everyday individuals **understand, track, and reduce** their personal carbon footprint. Developed entirely by **Nitin Patidar**.

This platform combines a high-performance **Python / FastAPI** backend with a responsive **React + TypeScript** frontend. Deployed as a single container on **Google Cloud Run**, it integrates **Google Gemini (Vertex AI)** for personalized sustainability coaching, uses **Firestore** for anonymous history tracking, and implements a deterministic **rule-based fallback** to guarantee 100% uptime.

---

## Table of Contents
1. [Core Pillars](#1-core-pillars)
2. [Detailed Architecture](#2-detailed-architecture)
3. [The Carbon Footprint Engine (Math & Factors)](#3-the-carbon-footprint-engine-math--factors)
4. [Graceful AI Degradation & Insights Engine](#4-graceful-ai-degradation--insights-engine)
5. [API Reference](#5-api-reference)
6. [Frontend & UX Highlights](#6-frontend--ux-highlights)
7. [Running Locally](#7-running-locally)
8. [Testing & Quality Gates](#8-testing--quality-gates)
9. [GCP Deployment Guide](#9-gcp-deployment-guide)
10. [Key Assumptions](#10-key-assumptions)
11. [Authors & License](#11-authors--license)

---

## 1. Core Pillars

The solution is architected around three user-centric phases:

| Pillar | Focus | Implementation |
|---|---|---|
| **Understand** | Clean, accessible inputs mapping to real emissions | Translates daily lifestyle choices (commuting, diet, energy bills) into annual kilograms of CO₂e using verified emission factors. |
| **Track** | Longitudinal progress without privacy intrusion | Uses an anonymous device ID generated client-side to persist historical footprint snapshots in Google Firestore. |
| **Reduce** | Actionable, quantified, and personalized advice | Leverages Google Gemini to deliver tailored recommendations. Automatically falls back to a custom rule-based engine if APIs are offline. |

---

## 2. Detailed Architecture

The platform uses a single-container design to eliminate CORS issues in production, lower operational overhead, and optimize Google Cloud Run pricing.

```text
Browser (React + TS, Vite)              Cloud Run (single container)
  • Semantic & Accessible UI   ──HTTP──► FastAPI Backend (Python)
  • Chart & Data Table Views              ├─ POST /api/calculate  (Pure Carbon Math)
  • Anonymous device id (Local)           ├─ POST /api/insights   (Gemini AI ──► Rule Engine Fallback)
                                          ├─ POST /api/entries    (Save Snapshot to Firestore)
                                          ├─ GET  /api/entries    (Fetch User History)
                                          └─ GET  /               (Serves built SPA static assets)
                                              │
                                              ├─► Vertex AI (Gemini 2.5 Flash) via ADC
                                              └─► Firestore (Native Database) via ADC
```

*   **No Secrets in Repo:** Authentication with Vertex AI and Firestore is handled implicitly using **Application Default Credentials (ADC)**, drawing IAM roles from the Cloud Run service account.
*   **Layered Codebase:** Pure logic (carbon calculations) is decoupled from transport layers (FastAPI routes) and persistence layers (Firestore), allowing 100% offline backend unit testing with zero mock servers.

---

## 3. The Carbon Footprint Engine (Math & Factors)

All calculations normalize inputs to **annual kilograms of CO₂-equivalent (kg CO₂e)**. The factors are meticulously sourced and documented inline in `backend/app/carbon/factors.py`.

### A. Transport Calculations
Calculates annual emissions from weekly travel and annual flight counts.

*   **Car Emissions:**
    $$\text{Emissions}_{\text{car}} = \text{km/week} \times 52 \text{ weeks} \times \text{Factor}_{\text{fuel}}$$
    *   *Petrol:* $0.170\text{ kg CO}_2\text{e/km}$
    *   *Diesel:* $0.171\text{ kg CO}_2\text{e/km}$
    *   *Hybrid:* $0.120\text{ kg CO}_2\text{e/km}$
    *   *Electric:* $0.047\text{ kg CO}_2\text{e/km}$ (includes national grid generation emissions)
*   **Public Transit:**
    $$\text{Emissions}_{\text{transit}} = \text{km/week} \times 52 \text{ weeks} \times 0.060\text{ kg CO}_2\text{e/km}$$
*   **Aviation:**
    Uses representative one-way distance estimates and applies radiative forcing uplifts.
    *   *Short-haul (< 1100 km):* $0.158\text{ kg CO}_2\text{e/km}$
    *   *Long-haul (>= 6500 km):* $0.150\text{ kg CO}_2\text{e/km}$
    $$\text{Emissions}_{\text{aviation}} = (\text{short-haul flights} \times 1100 \times 0.158) + (\text{long-haul flights} \times 6500 \times 0.150)$$

### B. Home Energy Calculations
Calculates energy consumption normalized by the number of household occupants to find the per-capita share.

*   **Electricity:** $0.450\text{ kg CO}_2\text{e/kWh}$ (average global grid intensity)
*   **Natural Gas:** $0.183\text{ kg CO}_2\text{e/kWh}$
$$\text{Emissions}_{\text{home}} = \frac{(\text{Electricity kWh/month} \times 12 \times 0.450) + (\text{Gas kWh/month} \times 12 \times 0.183)}{\text{Household Size}}$$

### C. Diet Footprint
Maps diet choices directly to annual food production footprints based on dietary studies:
*   *Heavy Meat Eater:* $3,300\text{ kg CO}_2\text{e/year}$
*   *Medium Meat Eater:* $2,500\text{ kg CO}_2\text{e/year}$
*   *Low Meat Eater:* $1,900\text{ kg CO}_2\text{e/year}$
*   *Pescatarian:* $1,700\text{ kg CO}_2\text{e/year}$
*   *Vegetarian:* $1,500\text{ kg CO}_2\text{e/year}$
*   *Vegan:* $1,050\text{ kg CO}_2\text{e/year}$

### D. Consumption & Waste
*   **Consumer Goods Spend:** $0.40\text{ kg CO}_2\text{e/USD}$ (annualized)
*   **Landfill Waste:** $0.580\text{ kg CO}_2\text{e/kg}$ of waste
$$\text{Emissions}_{\text{consumption}} = (\text{Spend USD/month} \times 12 \times 0.40) + (\text{Waste kg/week} \times 52 \times 0.580)$$

---

## 4. Graceful AI Degradation & Insights Engine

The platform operates on a robust fallback architecture that balances advanced AI capabilities with deterministic fallback reliability.

```text
                  POST /api/insights
                           │
             ┌─────────────┴─────────────┐
             ▼                           ▼
      USE_GEMINI=true?            USE_GEMINI=false?
             │                           │
      ┌──────┴──────┐                    ▼
     TRY           FAIL ──► [Rule-based Fallback Engine]
      │              (API quota,             │
      ▼               timeout, etc.)         ▼
[Google Gemini]                              │
      │                                      ▼
      └──────────────┬───────────────────────┘
                     ▼
             JSON Response
      (Identifies source: "gemini" or "rules")
```

### A. AI Coaching (Google Gemini 2.5 Flash)
*   Uses Vertex AI client SDK.
*   Enforces a strict JSON Schema configuration (`_RESPONSE_SCHEMA`) to prevent parsing errors and ensure the UI always receives structured objects.
*   Temperature is set to `0.4` for consistent, helpful, and non-hallucinated advice.
*   The API returns a summary and 2–4 recommendations, each detailing:
    *   `category`: The footprint category (transport, home, diet, consumption).
    *   `action`: Specific, realistic steps to reduce emissions.
    *   `estimated_annual_savings_kg`: Quantified yearly reductions.

### B. Deterministic Rule Engine (The Fallback)
If Vertex AI times out, returns an error, or is disabled, the platform executes a deterministic analysis:
1.  **Ranks categories** from largest contributor to smallest contributor based on the calculation breakdown.
2.  **Generates targeted recommendations** starting with the largest category:
    *   *Transport (Aviation dominant):* Suggests replacing flights with rail/video calls (estimated $50\%$ reduction of aviation emissions).
    *   *Transport (Car dominant):* Quantifies savings from switching to an electric vehicle.
    *   *Home Energy:* Recommends renewable tariffs and insulation (estimated $33\%$ reduction).
    *   *Diet:* Suggests moving down one step on the diet ladder (e.g. Medium Meat $\rightarrow$ Low Meat) and computes the exact difference.
    *   *Consumption:* Proposes buying durable/repairable goods and composting (estimated $25\%$ reduction).

---

## 5. API Reference

All requests and responses are strictly validated by Pydantic models.

### `POST /api/calculate`
Calculates the user's footprint breakdown and compares it with global averages.

*   **Request Payload (`CarbonInput`):**
    ```json
    {
      "transport": {
        "car_fuel": "petrol",
        "car_km_per_week": 150,
        "public_transit_km_per_week": 50,
        "short_haul_flights_per_year": 2,
        "long_haul_flights_per_year": 1
      },
      "home": {
        "electricity_kwh_per_month": 250,
        "natural_gas_kwh_per_month": 100,
        "household_size": 2
      },
      "diet": "medium_meat",
      "consumption": {
        "goods_spend_usd_per_month": 200,
        "waste_kg_per_week": 10
      }
    }
    ```
*   **Response Payload (`FootprintResult`):**
    ```json
    {
      "breakdown_kg": {
        "transport": 2454.4,
        "home": 784.8,
        "diet": 2500.0,
        "consumption": 1261.6
      },
      "total_annual_kg": 7000.8,
      "total_annual_tonnes": 7.001,
      "comparison": {
        "global_average_annual_kg": 4800.0,
        "sustainable_target_annual_kg": 2000.0,
        "ratio_to_global_average": 1.459,
        "ratio_to_sustainable_target": 3.500
      }
    }
    ```

### `POST /api/insights`
Generates personalized tips targeting the user's highest emission sectors.
*   **Request Payload:** Combination of `CarbonInput` and calculated `FootprintResult`.
*   **Response Payload (`InsightsResponse`):**
    ```json
    {
      "summary": "Your footprint is 7.0 tonnes/yr, which is above the 2.0 tonnes sustainable target.",
      "recommendations": [
        {
          "category": "diet",
          "action": "Shift toward a low meat diet — even a few plant-based days each week lowers food emissions.",
          "estimated_annual_savings_kg": 600.0
        }
      ],
      "source": "rules"
    }
    ```

### `POST /api/entries`
Saves a snapshot to the database. Keyed by `device_id`.
*   **Request Payload (`EntryCreate`):** Contains `device_id` (UUIDv4 format string) and `CarbonInput`.
*   **Response Payload:** Acknowledgment containing the created entry's database ID and timestamp.

---

## 6. Frontend & UX Highlights

The React SPA is built with vanilla CSS (no heavy utility libraries) and is optimized for premium look-and-feel:
*   **Design Tokens:** CSS custom properties define a dark-mode-first aesthetic with a curated color system, glassmorphism containers, and smooth scaling transitions.
*   **Accessibility First:**
    *   **Keyboard Nav:** Fully navigable without a mouse (logical tab index, keyboard focus states).
    *   **ARIA attributes:** All custom form controls are annotated with `aria-describedby` links to context-specific hints.
    *   **Screen Readers:** Employs `role="status"` and `aria-live` regions for live loading indicators and dynamic updates.
    *   **High Contrast:** Leverages AA-compliant contrast thresholds throughout the styling.

---

## 7. Running Locally

### A. Backend Setup
1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv .venv
    # Windows PowerShell:
    .venv\Scripts\Activate.ps1
    # macOS/Linux:
    source .venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements-dev.txt
    ```
4.  Launch the hot-reloading development server:
    ```bash
    USE_GEMINI=false USE_FIRESTORE=false uvicorn app.main:app --reload
    ```
    *(No Google Cloud Platform project credentials are required in offline developer mode).*

### B. Frontend Setup
1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the Vite local proxy server:
    ```bash
    npm run dev
    ```
    *This starts the app at `http://localhost:5173`, automatically proxying requests under `/api` to the backend running at `http://localhost:8000`.*

### C. Run as a Docker Container
To replicate the Cloud Run production container locally:
```bash
docker build -t carbon-platform .
docker run -p 8080:8080 -e USE_GEMINI=false -e USE_FIRESTORE=false carbon-platform
# Open http://localhost:8080 in your browser.
```

---

## 8. Testing & Quality Gates

The project maintains comprehensive test suites with strict coverage gates enforced on every push via GitHub Actions.

| Test Category | Command | Target/Gate | Focus Area |
|---|---|---|---|
| **Backend Tests** | `cd backend && pytest` | **100% Coverage** | Carbon equations, route logic, Firestore mock integration, Gemini fallback tests |
| **Frontend Tests** | `cd frontend && npm run test:coverage` | **>=90% Statements / >=85% Branches** | React component render, user actions, custom hooks, API calls |
| **Accessibility** | Built-in Vitest / Axe | **No failures** | Automated Axe Accessibility assertions on every React view |
| **Type Check** | Mypy (Strict) / Tsc | **No compiler errors** | Strict static type validation end-to-end |
| **Code Style** | Ruff / Prettier | **Compliance checked** | Python formatting (Ruff format), JS/TS formatting (Prettier) |

Run checks locally:
*   Python Lint: `ruff check .`
*   Python Format: `ruff format --check .`
*   Python Types: `mypy app`
*   JS/TS Lint: `npm run lint`
*   JS/TS Format: `npm run format:check`
*   JS/TS Types: `npm run typecheck`

---

## 9. GCP Deployment Guide

Build and deploy from source directly to Google Cloud Run:

1.  Set your Google Cloud project:
    ```bash
    gcloud config set project virtual-prompt-week-3
    ```
2.  Enable the required APIs:
    ```bash
    gcloud services enable run.googleapis.com aiplatform.googleapis.com \
        firestore.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com
    ```
3.  Provision the Native Firestore database:
    ```bash
    gcloud firestore databases create --location=us-central1
    ```
4.  Build and deploy the container:
    ```bash
    gcloud run deploy carbon-platform \
        --source . --region us-central1 --allow-unauthenticated \
        --set-env-vars PROJECT_ID=virtual-prompt-week-3,REGION=us-central1,USE_GEMINI=true,USE_FIRESTORE=true
    ```
5.  Assign Least Privilege Access roles to the Cloud Run Service Account:
    *   `roles/aiplatform.user` (Allows access to Vertex AI Gemini model)
    *   `roles/datastore.user` (Allows access to Firestore DB read/write actions)

---

## 10. Key Assumptions

*   **Average Estimates:** Calculations represent regional averages. They serve as an educational and behavioral tool, not as legal carbon auditing.
*   **Privacy First:** To encourage adoption, the app does not feature user login or collect personal identity details. History is saved under a client-side generated UUID that can be wiped by clearing local browser storage.
*   **Aviation Radiative Forcing:** Flight calculations account for higher altitude greenhouse gas impacts using standard DEFRA coefficients.
*   **Vertex AI Deployment:** The setup assumes Google Cloud Platform services are provisioned in the same region (`us-central1`) to minimize cross-region latency.

---

## 11. Authors & License

*   **Nitin Patidar** - *Lead Developer & Architect*

Distributed under the MIT License. See [LICENSE](LICENSE) for more details.

