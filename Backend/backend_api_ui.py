import json
import threading
import tkinter as tk
from tkinter import messagebox, ttk
from urllib import error, request


class BackendApiUi:
    def __init__(self, root):
        self.root = root
        self.root.title("Backend API UI")
        self.root.geometry("1200x700")
        self.root.minsize(1000, 600)

        self.base_url = tk.StringVar(value="http://127.0.0.1:8000")
        self.access_token = tk.StringVar(value="")
        self.last_result = {}

        self._build_ui()

    def _build_ui(self):
        top = ttk.Frame(self.root, padding=10)
        top.pack(fill="x")

        ttk.Label(top, text="URL base:").pack(side="left")
        url_entry = ttk.Entry(top, textvariable=self.base_url, width=45)
        url_entry.pack(side="left", padx=(8, 8))

        ttk.Button(top, text="Conectar", command=self.test_connection).pack(side="left")
        ttk.Button(top, text="Limpiar salida", command=self.clear_output).pack(side="left", padx=(8, 0))

        left = ttk.Frame(self.root)
        left.pack(side="left", fill="y", padx=(10, 10), pady=(0, 10))

        action_names = [
            ("health", "GET /api/health/", self.health_action),
            ("register", "POST /api/auth/register/", self.register_action),
            ("login", "POST /api/auth/login/", self.login_action),
            ("me", "GET /api/auth/me/", self.me_action),
            ("exercises", "GET /api/exercises/", self.exercises_action),
            ("detail", "GET /api/exercises/<id>/", self.exercise_detail_action),
            ("create exercise", "POST /api/exercises/", self.create_exercise_action),
            ("submit", "POST /api/submissions/submit/", self.submit_action),
        ]

        for _, label, callback in action_names:
            btn = ttk.Button(left, text=label, width=22, command=callback)
            btn.pack(fill="x", pady=4)

        form_frame = ttk.LabelFrame(self.root, text="Datos de la petición", padding=10)
        form_frame.pack(fill="x", padx=(0, 10), pady=(0, 10))

        fields = {
            "email": ("Email", "student@example.com"),
            "password": ("Password", "secure-pass-123"),
            "full_name": ("Nombre completo", "Alumno Demo"),
            "role": ("Role", "student"),
            "exercise_id": ("Exercise ID", "1"),
            "difficulty": ("Difficulty", "easy"),
            "language": ("Language", "python"),
            "title": ("Title", "Ejercicio demo"),
            "description": ("Description", "Suma dos números"),
            "code": ("Code", "print(1 + 2)"),
        }

        self.form_entries = {}
        for key, (label_text, default) in fields.items():
            row = ttk.Frame(form_frame)
            row.pack(fill="x", pady=3)
            ttk.Label(row, text=f"{label_text}:", width=18).pack(side="left")
            entry = ttk.Entry(row, width=60)
            entry.insert(0, default)
            entry.pack(side="left", padx=(8, 0), fill="x", expand=True)
            self.form_entries[key] = entry

        self.output = tk.Text(self.root, wrap="word", font=("Consolas", 10))
        self.output.pack(fill="both", expand=True, padx=(0, 10), pady=(0, 10))

        self.output.insert("end", "Selecciona una acción del menú para probar la API del backend.\n")
        self.output.configure(state="disabled")

    def clear_output(self):
        self.output.configure(state="normal")
        self.output.delete("1.0", "end")
        self.output.configure(state="disabled")

    def log(self, text):
        self.output.configure(state="normal")
        self.output.insert("end", str(text) + "\n")
        self.output.see("end")
        self.output.configure(state="disabled")

    def _get_field(self, key, default=""):
        value = self.form_entries.get(key, None)
        if value is None:
            return default
        return value.get().strip()

    def request(self, method, path, payload=None, auth_required=False):
        url = self.base_url.get().rstrip("/") + path
        headers = {"Content-Type": "application/json"}

        if auth_required and self.access_token.get():
            headers["Authorization"] = f"Bearer {self.access_token.get()}"

        data = None
        if payload is not None:
            data = json.dumps(payload).encode("utf-8")

        req = request.Request(url, data=data, headers=headers, method=method)

        try:
            with request.urlopen(req, timeout=20) as response:
                body = response.read().decode("utf-8")
                if not body:
                    return {"status": response.status, "message": "Sin contenido"}
                return json.loads(body)
        except error.HTTPError as exc:
            try:
                body = exc.read().decode("utf-8")
                detail = json.loads(body)
            except Exception:
                detail = {"error": str(exc)}
            raise RuntimeError(f"HTTP {exc.code}: {json.dumps(detail, ensure_ascii=False, indent=2)}")
        except Exception as exc:
            raise RuntimeError(f"Error de conexión: {exc}")

    def _run_async(self, func, *args, **kwargs):
        def worker():
            try:
                result = func(*args, **kwargs)
                self.root.after(0, lambda: self.log(json.dumps(result, ensure_ascii=False, indent=2)))
            except Exception as exc:
                self.root.after(0, lambda: self.log(f"ERROR\n{exc}"))

        thread = threading.Thread(target=worker, daemon=True)
        thread.start()

    def test_connection(self):
        self._run_async(self._test_connection_impl)

    def _test_connection_impl(self):
        try:
            response = self.request("GET", "/api/health/")
            return response
        except Exception as exc:
            raise RuntimeError(str(exc))

    def health_action(self):
        self._run_async(self._call_health)

    def _call_health(self):
        result = self.request("GET", "/api/health/")
        return result

    def register_action(self):
        payload = {
            "email": self._get_field("email", "newuser@example.com"),
            "password": self._get_field("password", "secure-pass-123"),
            "full_name": self._get_field("full_name", "User Demo"),
            "role": self._get_field("role", "student"),
        }
        self._run_async(self._register_impl, payload)

    def _register_impl(self, payload):
        result = self.request("POST", "/api/auth/register/", payload)
        return result

    def login_action(self):
        payload = {
            "email": self._get_field("email", "student@example.com"),
            "password": self._get_field("password", "secure-pass-123"),
        }
        self._run_async(self._login_impl, payload)

    def _login_impl(self, payload):
        result = self.request("POST", "/api/auth/login/", payload)
        if "access" in result:
            self.access_token.set(result["access"])
            self.log("Token JWT guardado en memoria.")
        return result

    def me_action(self):
        self._run_async(self._me_impl)

    def _me_impl(self):
        result = self.request("GET", "/api/auth/me/", auth_required=True)
        return result

    def exercises_action(self):
        params = []
        difficulty = self._get_field("difficulty", "")
        language = self._get_field("language", "")
        if difficulty:
            params.append(f"difficulty={difficulty}")
        if language:
            params.append(f"language={language}")
        path = "/api/exercises/"
        if params:
            path += "?" + "&".join(params)
        self._run_async(self._request_get, path, True)

    def exercise_detail_action(self):
        exercise_id = self._get_field("exercise_id", "1")
        self._run_async(self._request_get, f"/api/exercises/{exercise_id}/", False)

    def create_exercise_action(self):
        payload = {
            "title": self._get_field("title", "Ejercicio demo"),
            "description": self._get_field("description", "Descripcion demo"),
            "difficulty": self._get_field("difficulty", "easy"),
            "programming_language": self._get_field("language", "python"),
            "test_cases": [
                {
                    "input_data": "1 2",
                    "expected_output": "3",
                    "is_hidden": False,
                }
            ],
        }
        self._run_async(self._create_exercise_impl, payload)

    def _create_exercise_impl(self, payload):
        result = self.request("POST", "/api/exercises/", payload, auth_required=True)
        return result

    def submit_action(self):
        payload = {
            "exercise_id": int(self._get_field("exercise_id", "1")),
            "code": self._get_field("code", "print(1 + 2)"),
        }
        self._run_async(self._submit_impl, payload)

    def _submit_impl(self, payload):
        result = self.request("POST", "/api/submissions/submit/", payload, auth_required=True)
        return result

    def _request_get(self, path, auth_required):
        result = self.request("GET", path, auth_required=auth_required)
        return result


def main():
    root = tk.Tk()
    app = BackendApiUi(root)
    root.mainloop()


if __name__ == "__main__":
    main()
