from dataclasses import dataclass
from time import perf_counter

import httpx
from django.conf import settings


LANGUAGE_IDS = {"python": 71, "javascript": 63, "cpp": 54}


@dataclass
class TestResult:
    passed: bool
    status: str
    output: str
    execution_time: float | None


def _headers():
    if not settings.JUDGE0_API_KEY:
        raise RuntimeError("JUDGE0_API_KEY no está configurada")
    return {
        "X-RapidAPI-Key": settings.JUDGE0_API_KEY,
        "X-RapidAPI-Host": settings.JUDGE0_API_HOST,
        "Content-Type": "application/json",
    }


def run_test(language, code, input_data, expected_output):
    language_id = LANGUAGE_IDS.get(language)
    if language_id is None:
        raise ValueError(f"Lenguaje no soportado: {language}")

    started = perf_counter()
    with httpx.Client(timeout=30) as client:
        response = client.post(
            f"{settings.JUDGE0_URL}/submissions",
            params={"base64_encoded": "false", "wait": "true"},
            headers=_headers(),
            json={"source_code": code, "language_id": language_id, "stdin": input_data},
        )
        response.raise_for_status()
    result = response.json()
    output = (result.get("stdout") or result.get("stderr") or result.get("compile_output") or "").strip()
    status_id = result.get("status", {}).get("id")
    if status_id == 5:
        status = "TIME_LIMIT_EXCEEDED"
    elif status_id != 3:
        status = "ERROR"
    else:
        status = "ACCEPTED" if output == expected_output.strip() else "WRONG_ANSWER"
    return TestResult(status == "ACCEPTED", status, output, result.get("time") or perf_counter() - started)
