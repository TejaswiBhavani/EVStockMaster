import os
import requests

try:
    import streamlit as st  # type: ignore
except Exception:  # streamlit not available in all contexts
    class _Dummy:
        def __getattr__(self, _):
            return None
    st = _Dummy()

GEMINI_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent"


def ask_gemini(prompt: str) -> str | None:
    """Return model text or None if not configured/failed."""
    key = None
    try:
        key = getattr(st, 'secrets', {}).get('GEMINI_API_KEY') if getattr(st, 'secrets', None) else None
    except Exception:
        key = None
    key = key or os.getenv("GEMINI_API_KEY")
    if not key:
        return None

    try:
        r = requests.post(
            f"{GEMINI_URL}?key={key}",
            json={"contents": [{"parts": [{"text": prompt}]}]},
            timeout=20,
        )
        if not r.ok:
            return None
        data = r.json()
        return (
            data.get("candidates", [{}])[0]
            .get("content", {})
            .get("parts", [{}])[0]
            .get("text")
        )
    except Exception:
        return None