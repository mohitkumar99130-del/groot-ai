# GROOT
### Geospatial Remote-sensing & On-field Observation Technology
**Prototype Build Plan** — rebrand of SIH25099 (CropGuard AI / AgriSpectra AI)
Problem Statement Owner: MathWorks India Pvt. Ltd. | Theme: Agriculture, FoodTech & Rural Development

---

## 1. Why "GROOT" Fits

| Letter | Stands For | Maps to System Component |
|---|---|---|
| **G** | Geospatial | Field boundaries, GPS zones, PostGIS, heatmaps |
| **R** | Remote-sensing | Sentinel-2 / multispectral imagery, vegetation indices |
| **O** | On-field | ESP32 sensor node, farmer RGB photo capture |
| **O** | Observation | Temporal monitoring, historical trend store |
| **T** | Technology | Multimodal fusion AI, risk engine, dashboard |

One-line pitch (updated):
> **GROOT watches a field from space and from the ground at the same time — fusing satellite spectral data, live soil/weather sensors, and farmer photos to score crop health, flag pest/stress risk zones, explain every warning, and track how a field is trending over time.**

---

## 2. Prototype Objective (Scoped Down From the Full Vision)

The original plan describes a full production system. A **prototype** needs to prove the core idea end-to-end with the smallest slice that still demonstrates the USP: *Spectral + Sensor + RGB + Time → Detect → Explain → Predict Risk → Locate → Verify*.

**Assumption stated up front:** this plan targets a **4-week build** with your existing **6-person team**, producing a working, demo-able prototype (not the production-grade system). Adjust the timeline proportionally if your actual window is shorter or longer.

### What the prototype WILL do
- Cover **one crop** (Paddy/Rice) and **3–4 conditions** (Healthy, Water Stress, Nutrient/Vegetation Anomaly, Elevated Pest/Disease Risk).
- Pull real Sentinel-2 imagery for one or two demo plots via Google Earth Engine.
- Show a **field health heatmap** (grid of zone scores) on a map.
- Stream **live or simulated ESP32 sensor data** (soil moisture, temp, humidity) for at least one zone.
- Accept a **farmer RGB photo upload** and run it through a lightweight CNN.
- Run a **fusion model** (rule-based + simple ML, not deep fusion) that outputs a health score, risk %, and confidence.
- Show an **explanation panel** ("Why?") with contributing factors.
- Show a **temporal graph** (health/risk over time) using at least a few days/weeks of stored or seeded historical data.

### What is deliberately OUT of scope for the prototype
- Hyperspectral camera / drone imagery
- LSTM/Transformer temporal models (use trend + XGBoost instead)
- Multi-crop generalization
- Offline/local-language mode, PWA, active learning, alert prioritization
- Production-grade auth, multi-tenant farms, expert verification workflow

---

## 3. Simplified Architecture

```
 Sentinel-2 (Earth Engine)      ESP32 Sensor Node        Farmer RGB Photo
        |                             |                        |
        v                             v                        v
 Vegetation Indices           Sensor Ingest (MQTT)      Lightweight CNN
 (NDVI/NDMI baseline)         -> stored in Postgres      (symptom score)
        |                             |                        |
        +-------------- FUSION ENGINE (Python / FastAPI) ------+
                                   |
                +------------------+------------------+
                |                  |                  |
           Health Score      Pest/Risk %        Explanation +
                |                  |             Confidence
                +------------------+------------------+
                                   |
                                   v
                     GROOT Dashboard (Next.js + Leaflet)
                    Field Heatmap | Zone Detail | "Why?" | Trend Graph
```

---

## 4. Trimmed Tech Stack (prototype-friendly, low-cost)

| Layer | Tool | Notes |
|---|---|---|
| Satellite data | Google Earth Engine + Sentinel-2 | Free tier is enough for 1–2 demo plots |
| Spectral processing | Python (rasterio, numpy) or MATLAB if a licensed seat is available | MATLAB only if Member 1 already has access; otherwise Python is fine for a prototype |
| RGB model | MobileNet/EfficientNet (transfer learning) on a public rice-leaf dataset (e.g., PlantVillage rice subset) | Train on Colab/Kaggle GPU — free |
| Sensor node | ESP32 + capacitive soil moisture + DHT22 (temp/humidity) | If hardware is delayed, simulate readings with a script that mimics MQTT payloads |
| Messaging | MQTT (Mosquitto, free/local broker) | |
| Backend | FastAPI + PostgreSQL/PostGIS | |
| Fusion logic | Rule-based weighting first, then Random Forest/XGBoost once you have labeled fused examples | Matches "Stage 1: strong baselines" from the original plan |
| Frontend | Next.js + Leaflet (not MapLibre, to save setup time) + a simple chart library (Recharts/Chart.js) | |
| Deployment | Docker Compose locally, or a single free-tier cloud VM for demo day | |

---

## 5. Must-Have vs Stretch Feature Checklist

**Must-have for the demo to work:**
- [ ] One demo plot boundary defined in GEE + PostGIS
- [ ] NDVI/NDMI computed and converted into a 4×4 or 5×5 zone grid with scores
- [ ] Heatmap rendered on the dashboard map
- [ ] At least one zone wired to live/simulated ESP32 data
- [ ] Photo upload → CNN symptom score working end-to-end
- [ ] Fusion function combining spectral + sensor + RGB into health score & risk %
- [ ] "Why?" panel showing contributing factors (even if weights are hand-tuned)
- [ ] Trend graph with ≥5 seeded historical data points per zone

**Stretch (only if the above is solid before time runs out):**
- [ ] Real-time MQTT streaming instead of periodic polling
- [ ] Second demo plot / second crop condition
- [ ] Baseline-vs-fusion comparison chart for the evaluation slide
- [ ] Basic hotspot auto-detection (flag lowest-scoring zone automatically)

---

## 6. 4-Week Build Timeline

### Week 1 — Scope, Data, Baseline
- Finalize plot(s), crop (Paddy), and the 3–4 target conditions.
- Member 1 (Spectral): pull Sentinel-2 imagery via GEE for the chosen plot; compute NDVI/NDMI; produce a first static zone-score grid.
- Member 4 (IoT): assemble ESP32 node; get raw sensor readings logging locally.
- Member 5 (Backend/GIS): stand up FastAPI skeleton + PostgreSQL/PostGIS schema (fields, zones, sensor_readings, predictions).
- Member 6 (Frontend): scaffold Next.js app with Leaflet map showing static zone grid.
- Member 3 (ML/Fusion): draft the fusion scoring rules on paper (weights per factor) based on the "Example Multimodal Reasoning" cases in the original plan.

**Milestone:** static heatmap on a map, sensor node logging locally, schema in place.

### Week 2 — Model Training & Ingestion
- Member 2 (CV): train the RGB CNN on a public rice-leaf dataset; wrap it as a callable function/endpoint.
- Member 4: get ESP32 → MQTT → FastAPI → Postgres pipeline working (or simulate if hardware isn't ready).
- Member 1: refine spectral scoring into a repeatable function (not just a one-off notebook).
- Member 5: build API endpoints — get zone data, submit photo, get sensor history.
- Member 3: implement the fusion function in Python as a real endpoint (rule-based v1).

**Milestone:** all three signal sources (spectral, sensor, RGB) can be queried through the API independently.

### Week 3 — Fusion, Explanation, Temporal
- Member 3: connect fusion function to live API data; output health score + risk % + confidence.
- Member 3 + 5: add the explanation breakdown (contributing % per factor) and store predictions with timestamps for the trend graph.
- Member 6: build zone-detail page — health score, risk %, "Why?" panel, trend chart.
- Member 4: seed 5–10 days of historical sensor/spectral values (real if possible, backfilled/synthetic if not) so the trend graph has something to show.

**Milestone:** clicking a zone shows score, risk, explanation, and a trend graph.

### Week 4 — Integration, Polish, Demo Rehearsal
- Full "Scan → Compare → Confirm" flow wired: map → zone click → sensor/spectral view → photo upload → recalculated fusion risk → explanation.
- Record a fallback demo video / cached dataset in case live internet, GEE, or ESP32 fails on demo day.
- Prepare the evaluation slide: spectral-only vs sensor-only vs RGB-only vs fusion (even a small illustrative comparison strengthens the pitch).
- Full team dry-run of the demo script (Section 7) — keep it under 5 minutes.

**Milestone:** rehearsed, fallback-proofed, end-to-end demo.

---

## 7. Demo Script (Scan → Compare → Confirm)

1. Open the GROOT dashboard, show the field map for the demo plot.
2. Point out the heatmap — healthy vs stressed vs high-risk zones.
3. Click the highest-risk zone (e.g., "Zone C4").
4. Show spectral indicators (NDVI/NDMI trend) for that zone.
5. Show live/recent sensor telemetry (soil moisture, temp, humidity).
6. Show current risk score, health score, and confidence.
7. Upload an RGB phone photo taken "from that zone."
8. Watch the fusion risk recalculate in real time (e.g., 69% → 88%).
9. Click "Why?" to reveal the explanation breakdown.
10. Show the temporal graph — deterioration over the recorded days.
11. Close with the recommended action: "Inspect Zone C4."

Keep the whole walkthrough under 5 minutes, exactly as the original plan recommends.

---

## 8. Risk & Fallback Plan

| Risk | Fallback |
|---|---|
| Sentinel-2/GEE quota or connectivity issue on demo day | Pre-download and cache imagery/NDVI results locally |
| ESP32 hardware fails or isn't ready in time | Script that publishes realistic simulated MQTT sensor payloads |
| RGB model accuracy too low on demo photo | Curate 2–3 known-good demo photos in advance as backup |
| Fusion logic feels too "black box" for judges | Keep weights simple and explicitly shown in the "Why?" panel |
| Time runs short before Week 4 | Cut second plot/stretch features first, never cut the core Scan→Compare→Confirm flow |

---

## 9. Success Criteria for the Prototype

- End-to-end flow works live, without needing a developer to intervene.
- At least one zone shows a believable change in risk score after photo verification.
- Explanation panel gives a non-technical judge a clear "why" in one glance.
- Trend graph shows a visible deterioration or recovery pattern.
- Team can articulate, in one sentence, how fusion improved on any single signal alone (ties back to the evaluation comparison in Section 6).

---

*Derived from the original SIH25099 CropGuard AI / AgriSpectra AI blueprint, rescoped and rebranded as GROOT for a buildable team prototype.*
