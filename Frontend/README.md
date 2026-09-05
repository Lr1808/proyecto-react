# CodeGrade Frontend

Interfaz React para explorar retos de programación, filtrar por lenguaje y resolverlos desde un workspace con editor Monaco.

## Arranque

Desde la raíz del proyecto:

```powershell
cd Frontend
npm install
npm run dev
```

Vite mostrará la URL local, normalmente `http://localhost:5173`.

Para una compilación de producción:

```powershell
cd Frontend
npm run build
```

El catálogo inicial incluye JavaScript, Python, TypeScript, Java y C++. Los casos visibles se muestran en cada reto; los casos ocultos quedan reservados para la evaluación del backend.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the Oxlint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and Oxlint's TypeScript related rules in your project.
