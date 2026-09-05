from django.http import HttpResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response


@api_view(["GET"])
@permission_classes([AllowAny])
def health(request):
    return Response({"status": "ok", "message": "Django API funcionando"})


@api_view(["GET"])
@permission_classes([AllowAny])
def api_guide(request):
    html = """
    <!doctype html>
    <html lang="es">
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <title>CodeGrade | Aula de ejercicios</title>
      <style>
        :root { color-scheme: light; --ink: #18251f; --muted: #66756d; --green: #176b4c; --cream: #f5f1e8; --line: #dfe5dd; }
        * { box-sizing: border-box; }
        body { margin: 0; font-family: Georgia, "Times New Roman", serif; background: var(--cream); color: var(--ink); }
        .shell { width: min(1180px, calc(100% - 32px)); margin: auto; padding: 28px 0 56px; }
        header { display: flex; justify-content: space-between; align-items: end; gap: 20px; padding: 10px 0 30px; }
        h1 { margin: 0; font-size: clamp(2.3rem, 6vw, 4.8rem); line-height: .95; letter-spacing: -0.04em; }
        h2 { margin: 0 0 8px; font-size: 1.35rem; }
        p { line-height: 1.5; }
        .kicker { color: var(--green); font: 700 .78rem/1.2 Arial, sans-serif; letter-spacing: .14em; text-transform: uppercase; }
        .status { border: 1px solid var(--line); border-radius: 999px; padding: 10px 14px; background: #fffdf8; font: 700 .84rem Arial, sans-serif; white-space: nowrap; }
        .status::before { content: ""; display: inline-block; width: 8px; height: 8px; margin-right: 8px; border-radius: 50%; background: #d28b32; }
        .status.ready::before { background: #29915f; }
        nav { display: flex; flex-wrap: wrap; gap: 8px; padding: 12px 0 24px; border-bottom: 1px solid var(--line); }
        nav button { background: transparent; color: var(--green); border: 1px solid var(--line); }
        nav button.active { background: var(--green); color: #fff; }
        .page { display: none; padding-top: 22px; }
        .page.active { display: block; }
        .auth-gate { width: min(560px, 100%); margin: 8vh auto 0; }
        .auth-gate h1 { margin: 10px 0 14px; font-size: clamp(2.8rem, 8vw, 5.2rem); }
        .auth-options { display: flex; gap: 8px; margin: 20px 0 4px; }
        .auth-options button { flex: 1; }
        .auth-form { display: none; }
        .auth-form.active { display: block; }
        .app-content.hidden, .auth-gate.hidden { display: none; }
        .layout { display: grid; grid-template-columns: .85fr 1.4fr; gap: 18px; }
        .card { background: #fffdf8; border: 1px solid var(--line); border-radius: 10px; padding: 22px; box-shadow: 0 10px 30px rgba(39, 57, 47, .06); }
        .wide { grid-column: 1 / -1; }
        label { display: block; margin: 13px 0 5px; font: 700 .78rem Arial, sans-serif; color: var(--muted); }
        input, select, textarea { width: 100%; border: 1px solid #cbd6cc; border-radius: 6px; padding: 10px 11px; background: #fff; color: var(--ink); font: 15px Arial, sans-serif; }
        textarea { min-height: 170px; resize: vertical; font-family: Consolas, monospace; line-height: 1.45; }
        button { border: 0; border-radius: 6px; padding: 11px 15px; background: var(--green); color: white; cursor: pointer; font: 700 .86rem Arial, sans-serif; }
        button.secondary { background: #e8eee8; color: var(--green); }
        button:disabled { opacity: .55; cursor: wait; }
        .actions { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 16px; }
        .exercise { border: 1px solid var(--line); border-radius: 7px; padding: 13px; margin-top: 9px; cursor: pointer; background: #fff; }
        .exercise.selected { border-color: var(--green); box-shadow: 0 0 0 2px rgba(23,107,76,.12); }
        .exercise strong { display: block; margin-bottom: 4px; }
        .exercise-list { display: grid; gap: 9px; }
        .level-grid, .teacher-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 14px; }
        .level-card, .teacher-card { min-height: 150px; }
        .level-card { border-top: 4px solid var(--green); cursor: pointer; }
        .level-card:nth-child(2) { border-color: #c18a36; }
        .level-card:nth-child(3) { border-color: #9c4b45; }
        .level-card h3 { margin: 4px 0 8px; }
        .teacher-card h3 { margin: 0 0 8px; }
        .teacher-card ul { padding-left: 18px; margin-bottom: 0; }
        .count { color: var(--green); font: 700 2rem Arial, sans-serif; }
        .tag { color: var(--green); font: 700 .72rem Arial, sans-serif; text-transform: uppercase; }
        .muted, #feedback { color: var(--muted); }
        #feedback { min-height: 24px; margin: 14px 0 0; font: 14px Arial, sans-serif; }
        #result { white-space: pre-wrap; margin: 14px 0 0; padding: 14px; border-radius: 6px; background: #18251f; color: #ecf4ec; font: 13px/1.5 Consolas, monospace; overflow: auto; }
        @media (max-width: 760px) { header { align-items: start; flex-direction: column; } .layout { grid-template-columns: 1fr; } .wide { grid-column: auto; } }
      </style>
    </head>
    <body>
      <main class="shell">
        <section id="auth-gate" class="auth-gate card">
          <div class="kicker">CodeGrade / aula práctica</div><h1>Aprende haciendo.</h1>
          <p class="muted">Inicia sesión o crea una cuenta para acceder a tus ejercicios, niveles y autoevaluaciones.</p>
          <div class="auth-options"><button id="show-login">Iniciar sesión</button><button id="show-register" class="secondary">Registrarse</button></div>
          <div id="login-form" class="auth-form active">
            <label for="gate-email">Correo</label><input id="gate-email" type="email" value="student@example.com">
            <label for="gate-password">Contraseña</label><input id="gate-password" type="password" value="secure-pass-123">
            <div class="actions"><button id="gate-login">Entrar</button></div>
          </div>
          <div id="register-form" class="auth-form">
            <label for="gate-register-name">Nombre completo</label><input id="gate-register-name" value="Alumno Demo">
            <label for="gate-register-email">Correo</label><input id="gate-register-email" type="email" value="alumno@demo.com">
            <label for="gate-register-password">Contraseña</label><input id="gate-register-password" type="password" value="12345678">
            <div class="actions"><button id="gate-register">Crear cuenta</button></div>
          </div>
          <p id="gate-feedback"></p>
        </section>
        <div id="app-content" class="app-content hidden">
        <header><div><div class="kicker">CodeGrade / aula práctica</div><h1>Aprende haciendo.</h1></div><div id="status" class="status">Conectando...</div></header>
        <nav><button data-page="home" class="active">Inicio</button><button data-page="levels">Niveles</button><button data-page="teachers">Profesores</button><button data-page="evaluation">Evaluación</button></nav>
        <section id="home" class="page active">
          <div class="layout">
          <section class="card">
            <h2>Tu sesión</h2><p class="muted">Regístrate o entra para guardar tus evaluaciones.</p>
            <label for="email">Correo</label><input id="email" type="email" value="student@example.com">
            <label for="password">Contraseña</label><input id="password" type="password" value="secure-pass-123">
            <label for="full-name">Nombre (solo registro)</label><input id="full-name" value="Alumno Demo">
            <div class="actions"><button id="login">Entrar</button><button id="register" class="secondary">Crear cuenta</button><button id="logout" class="secondary">Salir</button></div>
            <p id="feedback"></p>
          </section>
          <section class="card">
            <h2>Para empezar</h2><p class="muted">Explora los niveles, conoce a los profesores y elige una práctica.</p>
            <div class="actions"><button data-page="levels">Ver niveles</button><button data-page="teachers" class="secondary">Ver profesores</button></div>
            <p id="home-summary" class="muted">Cargando resumen...</p>
          </section>
          </div>
        </section>
        <section id="levels" class="page">
          <div class="card"><h2>Ruta por niveles</h2><p class="muted">Cada nivel aumenta la complejidad de los problemas. Elige uno para ver sus ejercicios.</p><div class="level-grid"><article class="level-card card" data-filter="easy"><span class="tag">Nivel 01</span><h3>Inicial</h3><p>Variables, operaciones y primeros algoritmos.</p><span id="count-easy" class="count">0</span> <span class="muted">ejercicios</span></article><article class="level-card card" data-filter="medium"><span class="tag">Nivel 02</span><h3>Intermedio</h3><p>Funciones, lógica y resolución de problemas.</p><span id="count-medium" class="count">0</span> <span class="muted">ejercicios</span></article><article class="level-card card" data-filter="hard"><span class="tag">Nivel 03</span><h3>Avanzado</h3><p>Estructuras complejas y retos de optimización.</p><span id="count-hard" class="count">0</span> <span class="muted">ejercicios</span></article></div></div>
          <div class="card" style="margin-top:18px"><h2 id="level-title">Todos los ejercicios</h2><div id="level-exercises" class="exercise-list"><p class="muted">Cargando ejercicios...</p></div></div>
        </section>
        <section id="teachers" class="page">
          <div class="card"><h2>Profesores</h2><p class="muted">Encuentra quién creó cada práctica y explora su recorrido.</p><div id="teacher-list" class="teacher-grid"><p class="muted">Cargando profesores...</p></div></div>
        </section>
        <section id="evaluation" class="page">
          <div class="layout">
          <section class="card"><h2>Elige una práctica</h2><p class="muted">Cada ejercicio tiene sus propios casos de prueba.</p><div id="exercises" class="exercise-list"><p class="muted">Cargando ejercicios...</p></div></section>
          <section class="card wide">
            <h2 id="exercise-title">Selecciona un ejercicio</h2><p id="exercise-description" class="muted">La descripción aparecerá aquí.</p>
            <label for="code">Tu código</label><textarea id="code">print(1 + 2)</textarea>
            <div class="actions"><button id="submit">Enviar solución</button><button id="reload" class="secondary">Actualizar ejercicios</button></div>
            <pre id="result">Aquí aparecerá el resultado de la evaluación.</pre>
          </section>
          </div>
        </section>
        </div>
      </main>
      <script>
        const $ = (id) => document.getElementById(id);
        let token = localStorage.getItem('codegrade_access') || '';
        let exercises = [], selected = null;
        const show = (message) => { $('feedback').textContent = message; $('gate-feedback').textContent = message; };
        function enterApp() { $('auth-gate').classList.add('hidden'); $('app-content').classList.remove('hidden'); load(); }
        function showAuthForm(form) { $('login-form').classList.toggle('active', form === 'login'); $('register-form').classList.toggle('active', form === 'register'); $('gate-feedback').textContent = ''; }
        $('show-login').onclick = () => showAuthForm('login');
        $('show-register').onclick = () => showAuthForm('register');
        async function api(path, options = {}) {
          const headers = {'Content-Type': 'application/json', ...(options.headers || {})};
          if (token) headers.Authorization = `Bearer ${token}`;
          const response = await fetch(`/api${path}`, {...options, headers});
          const data = await response.json().catch(() => ({}));
          if (!response.ok) throw new Error(data.detail || data.message || 'La API devolvió un error');
          return data;
        }
        function openPage(page) { document.querySelectorAll('.page').forEach((node) => node.classList.toggle('active', node.id === page)); document.querySelectorAll('nav button').forEach((node) => node.classList.toggle('active', node.dataset.page === page)); history.replaceState(null, '', `#${page}`); }
        document.querySelectorAll('[data-page]').forEach((node) => node.onclick = () => openPage(node.dataset.page));
        function exerciseMarkup(item) { return `<div class="exercise ${selected && item.id === selected.id ? 'selected' : ''}" data-id="${item.id}"><strong>${item.title}</strong><span class="tag">${item.difficulty} · ${item.programming_language}</span><p>${item.description}</p></div>`; }
        function chooseExercise(id) { selected = exercises.find((item) => String(item.id) === String(id)); if (!selected) return; $('exercise-title').textContent = selected.title; $('exercise-description').textContent = `${selected.description} Profesor: ${selected.teacher.full_name}.`; openPage('evaluation'); renderExercises(); }
        function bindExercises() { document.querySelectorAll('.exercise').forEach((node) => node.onclick = () => chooseExercise(node.dataset.id)); }
        function renderExercises(filter = '') { const visible = filter ? exercises.filter((item) => item.difficulty === filter) : exercises; const html = visible.length ? visible.map(exerciseMarkup).join('') : '<p class="muted">No hay ejercicios en este nivel todavía.</p>'; $('exercises').innerHTML = html; $('level-exercises').innerHTML = html; bindExercises(); }
        function renderLevels() { ['easy', 'medium', 'hard'].forEach((level) => { $(`count-${level}`).textContent = exercises.filter((item) => item.difficulty === level).length; }); }
        function renderTeachers() { const groups = {}; exercises.forEach((item) => { const teacher = item.teacher; if (!groups[teacher.id]) groups[teacher.id] = {teacher, exercises: []}; groups[teacher.id].exercises.push(item); }); const cards = Object.values(groups).map(({teacher, exercises: items}) => `<article class="teacher-card card"><h3>${teacher.full_name}</h3><span class="tag">Profesor</span><p class="muted">${teacher.email}</p><ul>${items.map((item) => `<li><a href="#evaluation" data-exercise="${item.id}">${item.title}</a></li>`).join('')}</ul></article>`).join(''); $('teacher-list').innerHTML = cards || '<p class="muted">Todavía no hay profesores con ejercicios.</p>'; document.querySelectorAll('[data-exercise]').forEach((node) => node.onclick = (event) => { event.preventDefault(); chooseExercise(node.dataset.exercise); }); }
        document.querySelectorAll('[data-filter]').forEach((node) => node.onclick = () => { $('level-title').textContent = `Ejercicios de nivel ${node.dataset.filter}`; renderExercises(node.dataset.filter); });
        async function load() { try { exercises = await api('/exercises/'); renderExercises(); renderLevels(); renderTeachers(); $('home-summary').textContent = `${exercises.length} ejercicios disponibles en ${new Set(exercises.map((item) => item.teacher.id)).size} profesores.`; } catch (error) { $('exercises').innerHTML = `<p class="muted">${error.message}</p>`; $('level-exercises').innerHTML = $('exercises').innerHTML; $('teacher-list').innerHTML = $('exercises').innerHTML; } }
        async function health() { try { await api('/health/'); $('status').textContent = 'API conectada'; $('status').classList.add('ready'); } catch (error) { $('status').textContent = 'API sin conexión'; } }
        async function auth(path, register) { const body = {email: $('email').value, password: $('password').value}; if (register) Object.assign(body, {full_name: $('full-name').value, role: 'student'}); try { const data = await api(path, {method: 'POST', body: JSON.stringify(body)}); token = data.access; localStorage.setItem('codegrade_access', token); enterApp(); show(register ? 'Cuenta creada correctamente.' : 'Sesión iniciada.'); } catch (error) { show(error.message); } }
        $('login').onclick = () => auth('/auth/login/', false); $('register').onclick = () => auth('/auth/register/', true);
        $('gate-login').onclick = () => { $('email').value = $('gate-email').value; $('password').value = $('gate-password').value; auth('/auth/login/', false); };
        $('gate-register').onclick = () => { $('email').value = $('gate-register-email').value; $('password').value = $('gate-register-password').value; $('full-name').value = $('gate-register-name').value; auth('/auth/register/', true); };
        $('logout').onclick = () => { token = ''; localStorage.removeItem('codegrade_access'); $('app-content').classList.add('hidden'); $('auth-gate').classList.remove('hidden'); showAuthForm('login'); $('gate-feedback').textContent = 'Sesión cerrada.'; };
        $('reload').onclick = load;
        $('submit').onclick = async () => { if (!token) return show('Inicia sesión antes de enviar código.'); if (!selected) return show('Selecciona un ejercicio.'); $('submit').disabled = true; try { const data = await api('/submissions/submit/', {method: 'POST', body: JSON.stringify({exercise_id: selected.id, code: $('code').value})}); $('result').textContent = JSON.stringify(data, null, 2); show(`Resultado: ${data.verdict} · ${data.score}%`); } catch (error) { $('result').textContent = error.message; show(error.message); } finally { $('submit').disabled = false; } };
        const initialPage = ['home', 'levels', 'teachers', 'evaluation'].includes(location.hash.slice(1)) ? location.hash.slice(1) : 'home'; openPage(initialPage); if (token) enterApp(); health();
      </script>
    </body>
    </html>
    """
    return HttpResponse(html)
