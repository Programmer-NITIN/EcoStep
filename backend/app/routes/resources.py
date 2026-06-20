from __future__ import annotations
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter(prefix="/api/resources", tags=["resources"])

class ResourceItem(BaseModel):
    id: str
    title: str
    description: str
    category: str
    readTime: str
    imageUrl: str
    tag: str | None = None

class CategoryItem(BaseModel):
    id: str
    title: str
    description: str
    icon: str
    linkText: str
    color: str

RESOURCES_DATA: list[dict[str, str | None]] = [
    {
        "id": "1",
        "title": "5 Ways to Decarbonize Your Home",
        "description": "Practical, high-impact strategies to reduce your household's carbon footprint, from smart thermostats to passive cooling techniques.",
        "category": "Expert Deep-Dives",
        "readTime": "12 min read",
        "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuDFo8G6QnFq2FjJ935qVw87hV-1LidqZ-w7dYhZApz-n0e7bH8d_Q7x_p0g6d4n9c3a3f_r9m-KxS5Ld_uNq4R2FvK0s5l6wA",
        "tag": "Expert Deep-Dive"
    },
    {
        "id": "2",
        "title": "The True Cost of Fast Fashion",
        "description": "Unpacking the environmental and social impacts of disposable clothing, and how to build a mindful wardrobe.",
        "category": "Beginner Guides",
        "readTime": "8 min read",
        "imageUrl": "https://lh3.googleusercontent.com/aida-public/AB6AXuDlsDq_OkuKlK3Cj9dlB19vle2Gd-7Z21mvUdyPP50ESRCb_9afpEHVz3Lv3pgXaLOYQJC2eIKqgDT05HgGTTZ1WvQ0uT0orLt7XHMFCjia8CkR9JVpu9xnSDzZOA8jm17FKrIVUrh0JexCORqBN4OkOdfVhLoQRT1UlgHhbwe1Lfn4pDRvW42ZSwKoeJHKnlRah5H0oSVbnpY0j7GKmHyU4oO05EaF9AEqh3IojnM2GfLm3CSPr3hTxB1mSuLsB2EFWY2TVJ6WAbCq",
        "tag": "Beginner Guide"
    }
]

CATEGORIES_DATA: list[dict[str, str]] = [
    {
        "id": "1",
        "title": "Beginner Guides",
        "description": "Start your journey here. Simple, actionable steps to understand and reduce your daily impact.",
        "icon": "eco",
        "linkText": "Explore Guides",
        "color": "var(--primary)"
    },
    {
        "id": "2",
        "title": "Expert Deep-Dives",
        "description": "Data-driven analysis and comprehensive reports on complex environmental topics.",
        "icon": "experiment",
        "linkText": "Read Analysis",
        "color": "var(--secondary)"
    },
    {
        "id": "3",
        "title": "Sustainable Reviews",
        "description": "Honest, rigorous evaluations of eco-friendly products and services to help you choose wisely.",
        "icon": "shopping_bag",
        "linkText": "View Reviews",
        "color": "var(--tertiary)"
    }
]

@router.get("", response_model=list[ResourceItem])
def get_resources() -> list[dict[str, str | None]]:
    """Return all featured educational articles."""
    return RESOURCES_DATA

@router.get("/categories", response_model=list[CategoryItem])
def get_categories() -> list[dict[str, str]]:
    """Return resources categories."""
    return CATEGORIES_DATA
