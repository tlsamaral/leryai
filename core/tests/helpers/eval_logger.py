import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional

RESULTS_DIR = Path(__file__).parent.parent.parent / "eval-results"


def log_eval_result(
    fixture: str,
    model: str,
    scores: dict,
    latency_ms: float,
    passed: bool,
    failure_reason: Optional[str] = None,
) -> None:
    RESULTS_DIR.mkdir(exist_ok=True)
    filename = RESULTS_DIR / f"eval-{datetime.now(timezone.utc).date()}.jsonl"
    record = {
        "fixture": fixture,
        "model": model,
        "task_achievement": scores.get("task_achievement"),
        "grammar": scores.get("grammar"),
        "vocabulary": scores.get("vocabulary"),
        "fluency": scores.get("fluency"),
        "total_score": scores.get("total_score"),
        "grammatical_fixes": scores.get("grammatical_fixes", ""),
        "reasoning": scores.get("reasoning", ""),
        "latency_ms": latency_ms,
        "pass": passed,
        "failure_reason": failure_reason,
        "timestamp": datetime.now(timezone.utc).isoformat(),
    }
    with open(filename, "a") as f:
        f.write(json.dumps(record) + "\n")


def assert_pillar_in_range(
    fixture: str, pillar: str, actual: int, range_: tuple[int, int]
) -> Optional[str]:
    lo, hi = range_
    if actual < lo or actual > hi:
        return f"{fixture} — {pillar}: expected [{lo}, {hi}], got {actual}"
    return None
