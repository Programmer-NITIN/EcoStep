"""Integration tests for the HTTP API via FastAPI's TestClient."""

from __future__ import annotations


def test_health(client):
    resp = client.get("/api/health")
    assert resp.status_code == 200
    assert resp.json()["status"] == "ok"


def test_calculate_returns_breakdown(client):
    resp = client.post(
        "/api/calculate",
        json={
            "transport": {"car_km_per_week": 100, "car_fuel": "petrol"},
            "diet": "vegan",
        },
    )
    assert resp.status_code == 200
    body = resp.json()
    assert set(body["breakdown_kg"]) == {"transport", "home", "diet", "consumption"}
    assert body["total_annual_kg"] > 0
    assert "comparison" in body


def test_calculate_rejects_negative_values(client):
    resp = client.post("/api/calculate", json={"transport": {"car_km_per_week": -5}})
    assert resp.status_code == 422  # Pydantic validation rejects out-of-bounds input


def test_calculate_rejects_unknown_enum(client):
    resp = client.post("/api/calculate", json={"diet": "carnivore_supreme"})
    assert resp.status_code == 422


def test_insights_uses_rules_when_gemini_disabled(client):
    resp = client.post("/api/insights", json={"diet": "heavy_meat"})
    assert resp.status_code == 200
    body = resp.json()
    assert body["source"] == "rules"
    assert len(body["recommendations"]) >= 1


def test_entries_roundtrip(client):
    calc = client.post("/api/calculate", json={"diet": "vegan"}).json()
    device_id = "device-test-1234"
    create = client.post(
        "/api/entries",
        json={"device_id": device_id, "input": {"diet": "vegan"}, "result": calc},
    )
    assert create.status_code == 201

    listing = client.get(f"/api/entries/{device_id}")
    assert listing.status_code == 200
    entries = listing.json()
    assert len(entries) == 1
    assert entries[0]["device_id"] == device_id


def test_entries_rejects_bad_device_id(client):
    resp = client.get("/api/entries/short")  # fails min_length / pattern
    assert resp.status_code == 422


def test_unknown_api_route_returns_json_404(client):
    resp = client.get("/api/does-not-exist")
    assert resp.status_code == 404
    assert resp.headers["content-type"].startswith("application/json")


def test_security_headers_present(client):
    resp = client.get("/api/health")
    assert resp.headers["X-Content-Type-Options"] == "nosniff"
    assert resp.headers["X-Frame-Options"] == "DENY"
    assert "Content-Security-Policy" in resp.headers


def test_actions_api(client):
    # Setup device history first
    calc = client.post("/api/calculate", json={"diet": "vegan"}).json()
    device_id = "device-test-1234-567890"
    entries_resp = client.post(
        "/api/entries",
        json={"device_id": device_id, "input": {"diet": "vegan"}, "result": calc},
    )
    assert entries_resp.status_code == 201

    # Test GET list of actions
    resp = client.get("/api/actions")
    assert resp.status_code == 200
    actions_list = resp.json()
    assert len(actions_list) > 0
    first_action_id = actions_list[0]["id"]

    # Test POST complete action
    complete_resp = client.post(f"/api/actions/{first_action_id}/complete")
    assert complete_resp.status_code == 200
    state = complete_resp.json()
    assert state["id"] == first_action_id
    assert state["completed"] is True

    # Test POST complete of non-existent action
    complete_bad_resp = client.post("/api/actions/bad-id/complete")
    assert complete_bad_resp.status_code == 404


def test_community_api(client):
    # Test GET community leaderboard global
    resp = client.get("/api/community/leaderboard?scope=global")
    assert resp.status_code == 200
    leaderboard = resp.json()
    assert len(leaderboard) > 0

    # Test GET community leaderboard local
    resp_local = client.get("/api/community/leaderboard?scope=local")
    assert resp_local.status_code == 200
    leaderboard_local = resp_local.json()
    assert len(leaderboard_local) > 0

    # Test GET community stats
    stats_resp = client.get("/api/community/stats")
    assert stats_resp.status_code == 200
    assert "totalSavedGlobal" in stats_resp.json()


def test_resources_api(client):
    # Test GET resources list
    resp = client.get("/api/resources")
    assert resp.status_code == 200
    resources_list = resp.json()
    assert len(resources_list) > 0

    # Test GET resources categories
    cat_resp = client.get("/api/resources/categories")
    assert cat_resp.status_code == 200
    categories = cat_resp.json()
    assert len(categories) > 0

