# 🎓 EduEval — Plataforma de Aprendizaje Técnico & Bootcamps en Vivo

[![React 19](https://img.shields.io/badge/Frontend-React_19_+_Vite-61DAFB?logo=react)](https://react.dev/)
[![Django 5.2](https://img.shields.io/badge/Backend-Django_5.2_+_DRF-092E20?logo=django)](https://www.djangoproject.com/)
[![Supabase](https://img.shields.io/badge/Database-Supabase_PostgreSQL-3ECF8E?logo=supabase)](https://supabase.com/)
[![Judge0](https://img.shields.io/badge/Evaluator-Judge0_Code_Runner-0052CC)](https://judge0.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**EduEval** es una plataforma interactiva de aprendizaje técnico, evaluación automatizada de código y bootcamps en vivo, inspirada en los estándares visuales y metodológicos de **[Código Facilito](https://codigofacilito.com/)**.

---

## ✨ Características Principales

### 🚀 1. Landing Page Hub & Bootcamps (Inspiración Código Facilito)
- **Hero Interactivo**: Ticker de emisión en vivo (`NUEVA EDICIÓN`), consola interactiva de solución de ejercicios con feedback inmediato (`4/4 Casos pasados`), medidor de racha y efectos dinámicos con `PixelSwap` y `ClickSpark`.
- **Bootcamps en Vivo**: Tarjetas de formación intensiva (*Web Full Stack*, *Python & Backend*, *Arquitectura & SQL*) con indicadores de estado (`EN VIVO`, `INSCRIPCIONES ABIERTAS`), etiquetas de tecnologías, fechas de inicio y avatares de instructores.
- **Rutas de Aprendizaje Estructuradas**: Guiadas paso a paso desde nivel principiante hasta avanzado.
- **Membresía Premium EduEval**: Banner de nivel superior con beneficios exclusivos y llamada a la acción.

### 📝 2. Gestor de Tareas Híbrido & Editor a Mano
- **Editor de Código Interactivo**: Diseñado para fomentar la escritura de código real sin autocompletado intrusivo.
- **Resaltado y Sintaxis**: Soporte multi-lenguaje (Python y JavaScript) con numeración de líneas e indicador de lenguaje activo.
- **Temporizador Dual**: Cronómetro de tiempo dedicado y temporizador tipo **Pomodoro** (Enfocado / Descanso) por cada tarea.
- **Consola de Pruebas**: Ejecución local de casos de prueba y reporte de métricas de progreso.

### 💬 3. Chat en Directo Docente-Estudiante
- **Mensajería Flotante**: Drawer interactivo para comunicación directa entre alumnos y profesores.
- **Doble Motor de Sincronización**:
  - Sincronización mediante `localStorage` y eventos personalizados en **Modo Demo** (`VITE_SKIP_AUTH=true`).
  - Sincronización en tiempo real vía **REST API** y **Django Channels WebSockets** en producción.
- **Respuestas Rápidas e Insignias**: Contador de mensajes no leídos, avatares de perfil e insignias de rol (*Docente* 👨‍🏫 / *Estudiante* 🎓).

### 🏆 4. Gamificación, Métricas y Certificados
- Contador de XP acumulado, nivel del estudiante y rachas de días consecutivos.
- Tabla de clasificación (*Leaderboard*) en tiempo real.
- Generación y descarga de **Certificados de Dominio Técnico** con vista previa e impresión formateada.

---

## 🛠️ Arquitectura y Tecnologías

```mermaid
graph TD
    subgraph Frontend ["Frontend (React 19 + Vite)"]
        UI[Landing / Dashboard UI]
        ChatWidget[Chat Directo Docente-Estudiante]
        HybridTask[Gestor de Tareas Híbrido & Pomodoro]
        Editor[Editor a Mano + Console]
    end

    subgraph Backend ["Backend (Django 5.2 DRF + Channels)"]
        API[Django REST Framework API]
        Auth[Supabase JWT Auth / Demo Auth]
        Evaluator[Evaluador Interno & Judge0 Service]
        ChatRouter[Chat Router API]
    end

    subgraph External ["Servicios Externos & DB"]
        SupaDB[(Supabase PostgreSQL)]
        Judge0[Judge0 API Runner]
    end

    UI -->|HTTP / REST| API
    ChatWidget -->|REST / WebSocket| ChatRouter
    API --> Auth
    API --> SupaDB
    Evaluator -->|Remote Code Exec| Judge0
```

---

## 📁 Estructura del Proyecto

```text
Proyecto_react/
├── Backend/                 # Django 5.2 + DRF + Channels (Python)
│   ├── api/                 # Endpoints REST, Auth, Evaluador, Router de Chat
│   ├── config/              # Configuración general y settings
│   ├── seed_data.py         # Script idempotente de carga de datos iniciales
│   └── manage.py
├── Frontend/                # React 19 + Vite (JavaScript)
│   ├── src/
│   │   ├── components/      # LandingPage, HybridTaskManager, LiveTeacherStudentChat, etc.
│   │   ├── lib/             # Catálogo dinámico y cliente API
│   │   ├── App.jsx          # Aplicación principal
│   │   └── App.css          # Sistema de diseño y temas visuales
│   ├── index.html
│   └── vite.config.js
├── AGENTS.md                # Directrices del proyecto
└── README.md                # Documentación principal
```

---

## ⚡ Guía de Instalación y Ejecución Local

### Prerrequisitos
- **Node.js**: v18.0 o superior
- **Python**: v3.11 o superior
- **Git**

---

### 1. Configuración del Backend (Django)

1. Dirígete a la carpeta `Backend`:
   ```bash
   cd Backend
   ```

2. Crea y activa el entorno virtual:
   - **Windows (PowerShell)**:
     ```powershell
     python -m venv .venv
     .\.venv\Scripts\Activate.ps1
     ```

3. Instala las dependencias:
   ```bash
   pip install -r requirements.txt
   ```

4. Configura el archivo de variables de entorno `.env` en `Backend/.env` (basado en `.env.example`):
   ```env
   DATABASE_URL=postgresql://usuario:password@host:5432/postgres
   SUPABASE_URL=https://tu-proyecto.supabase.co
   SUPABASE_ANON_KEY=tu_anon_key
   JUDGE0_API_KEY=tu_judge0_api_key
   ```

5. Aplica las migraciones y puebla la base de datos con usuarios de prueba:
   ```bash
   python manage.py migrate
   python seed_data.py
   ```

6. Inicia el servidor de desarrollo:
   ```bash
   python manage.py runserver
   ```
   *El backend estará disponible en `http://127.0.0.1:8000`.*

---

### 2. Configuración del Frontend (React + Vite)

1. Abre una nueva terminal y dirígete a la carpeta `Frontend`:
   ```bash
   cd Frontend
   ```

2. Instala las dependencias de Node:
   ```bash
   npm install
   ```

3. Configura el archivo `.env` en `Frontend/.env`:
   ```env
   VITE_SKIP_AUTH=true
   ```
   *(Nota: `VITE_SKIP_AUTH=true` habilita el **Modo Demo** sin requerir credenciales reales de Supabase).*

4. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```
   *El frontend estará disponible en `http://localhost:5173`.*

---

## 🔑 Credenciales de Prueba (Modo Demo)

| Rol | Correo Electrónico | Contraseña |
| :--- | :--- | :--- |
| **Estudiante** 🎓 | `student@example.com` | `demo1234` |
| **Docente** 👨‍🏫 | `admin@example.com` | `Admin1234!` |

---

## 🧪 Pruebas y Calidad de Código

- **Comprobación de Sintaxis Frontend (Oxlint)**:
  ```bash
  cd Frontend
  npm run lint
  ```

- **Pruebas Unitarias del Backend (Django)**:
  ```bash
  cd Backend
  python manage.py test --keepdb
  ```

---

## 📄 Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo `LICENSE` para más detalles.
