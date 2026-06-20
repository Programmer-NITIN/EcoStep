from __future__ import annotations
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/community", tags=["community"])

class LeaderboardEntry(BaseModel):
    rank: int
    name: str
    avatarUrl: str
    avatarLetter: str | None = None
    streak: int
    co2Saved: float

class ComparisonStat(BaseModel):
    label: str
    value: float
    color: str

class CommunityStats(BaseModel):
    totalSavedGlobal: float
    comparison: list[ComparisonStat]

GLOBAL_LEADERBOARD = [
    { "rank": 1, "name": "Sarah Jenkins", "avatarUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuB9ba01L6WEkEq7o70vQAV-_qo0vNpffMCNs9wQjOZHo_TZyXwLbKWTcbmkhxZ2rbmgnDpwA_ty7YrA3fTBx3O4I0awTNl6zZk584p3RKwgd0z6VbUrVjQwzD8J2nsewausYnmwAbP-TVwrE9_gqNM0ZsCrshb0QFViwkIoFppWm_p2JbvxjAtko6B92XOLyqGI01Zs8uYJI1SlNJJjoODqI3LaPbT-ptRqfswwKsNZOu865wNWeFELjBV7Ka1WvG7QeH7biMEFwcpa", "streak": 42, "co2Saved": 340.0 },
    { "rank": 2, "name": "Green Team Alpha", "avatarUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuDlsDq_OkuKlK3Cj9dlB19vle2Gd-7Z21mvUdyPP50ESRCb_9afpEHVz3Lv3pgXaLOYQJC2eIKqgDT05HgGTTZ1WvQ0uT0orLt7XHMFCjia8CkR9JVpu9xnSDzZOA8jm17FKrIVUrh0JexCORqBN4OkOdfVhLoQRT1UlgHhbwe1Lfn4pDRvW42ZSwKoeJHKnlRah5H0oSVbnpY0j7GKmHyU4oO05EaF9AEqh3IojnM2GfLm3CSPr3hTxB1mSuLsB2EFWY2TVJ6WAbCq", "streak": 28, "co2Saved": 315.0 },
    { "rank": 3, "name": "Marcus Chen", "avatarUrl": "", "avatarLetter": "M", "streak": 14, "co2Saved": 290.0 }
]

LOCAL_LEADERBOARD = [
    { "rank": 1, "name": "Marcus Chen", "avatarUrl": "", "avatarLetter": "M", "streak": 14, "co2Saved": 290.0 },
    { "rank": 2, "name": "Elena Rostova", "avatarUrl": "", "avatarLetter": "E", "streak": 12, "co2Saved": 245.0 },
    { "rank": 3, "name": "David Kim", "avatarUrl": "", "avatarLetter": "D", "streak": 9, "co2Saved": 180.0 }
]

@router.get("/leaderboard", response_model=list[LeaderboardEntry])
def get_leaderboard(scope: str = "local") -> list[dict[str, object]]:
    """Return top eco champions based on scope (global or local)."""
    if scope == "global":
        return GLOBAL_LEADERBOARD
    return LOCAL_LEADERBOARD

@router.get("/stats", response_model=CommunityStats)
def get_community_stats() -> dict[str, object]:
    """Return global stats and comparison data."""
    return {
        "totalSavedGlobal": 1452890.0,
        "comparison": [
            { "label": "You", "value": 1.2, "color": "var(--primary-fixed-dim)" },
            { "label": "National Avg", "value": 1.8, "color": "var(--tertiary-fixed-dim)" },
            { "label": "Eco-Champion", "value": 0.6, "color": "var(--primary)" }
        ]
    }
