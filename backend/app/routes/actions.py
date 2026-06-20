from __future__ import annotations
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

router = APIRouter(prefix="/api/actions", tags=["actions"])

class Action(BaseModel):
    id: str
    title: str
    description: str
    co2_kg: float
    category: str
    icon: str
    completed: bool

INITIAL_ACTIONS = [
    { "id": "1", "title": "No Plastic Day", "description": "Avoid all single-use plastics today. Bring your own bags, bottles, and containers.", "co2_kg": 5.0, "category": "low-effort", "icon": "eco", "completed": False },
    { "id": "2", "title": "Public Transit Only", "description": "Commute entirely via public transportation or bicycle for the whole day.", "co2_kg": 15.0, "category": "high-impact", "icon": "directions_bus", "completed": True },
    { "id": "3", "title": "Meatless Monday", "description": "Commit to eating entirely plant-based meals for one day this week.", "co2_kg": 8.0, "category": "habit", "icon": "restaurant", "completed": False },
    { "id": "4", "title": "Energy Audit", "description": "Turn off all standby devices and switch to energy-saving mode for 24 hours.", "co2_kg": 3.0, "category": "low-effort", "icon": "bolt", "completed": False },
    { "id": "5", "title": "Local Market Run", "description": "Buy all groceries from local farmers markets to reduce transport emissions.", "co2_kg": 12.0, "category": "one-time", "icon": "storefront", "completed": False },
    { "id": "6", "title": "Carpool Week", "description": "Share rides with colleagues or friends for the entire work week.", "co2_kg": 20.0, "category": "high-impact", "icon": "groups", "completed": False }
]

@router.get("", response_model=list[Action])
def get_actions() -> list[dict[str, object]]:
    """Return available actions for the tracker."""
    return INITIAL_ACTIONS

@router.post("/{action_id}/complete", response_model=Action)
def complete_action(action_id: str) -> dict[str, object]:
    """Mark an action as completed."""
    for action in INITIAL_ACTIONS:
        if action["id"] == action_id:
            action["completed"] = True
            return action
    raise HTTPException(status_code=404, detail="Action not found")
