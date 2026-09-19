import {
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle2,
  Clock,
  Code2,
  Crown,
  GraduationCap,
  Laptop,
  Layers,
  MessageSquare,
  Play,
  Radio,
  Sparkles,
  Star,
  Zap,
} from 'lucide-react'
import PixelSwap from './PixelSwap'

const bootcamps = [
  {
    id: 'bc-1',
    title: 'Bootcamp de Desarrollo Web Full Stack',
    category: 'JavaScript & React',
    level: 'Intermedio',
    duration: '12 Semanas',
    liveDate: 'Clases en Vivo · Mar y Jue',
    status: 'EN VIVO',
    badgeColor: 'yellow',
    instructor: 'Prof. Luis & Mentores',
    studentsCount: 1420,
    rating: '4.9/5',
    imageBg: 'linear-gradient(135deg, rgba(234, 179, 8, .2), rgba(202, 138, 4, .4))',
    techs: ['JavaScript', 'React 19', 'Node.js', 'Vite'],
  },
  {
    id: 'bc-2',
    title: 'Bootcamp de Python, Django & Backend',
    category: 'Python & Databases',
    level: 'Principiante a Avanzado',
    duration: '10 Semanas',
    liveDate: 'Próximo Inicio · 15 de Oct',
    status: 'INSCRIPCIONES ABIERTAS',
    badgeColor: 'cyan',
    instructor: 'Equipo EduEval Backend',
    studentsCount: 980,
    rating: '4.95/5',
    imageBg: 'linear-gradient(135deg, rgba(14, 165, 233, .2), rgba(2, 132, 199, .4))',
    techs: ['Python 3.11', 'Django REST', 'PostgreSQL', 'Judge0'],
  },
  {
    id: 'bc-3',
    title: 'Bootcamp de Arquitectura de Software & SQL',
    category: 'Bases de Datos & DevOps',
    level: 'Avanzado',
    duration: '8 Semanas',
    liveDate: 'Clases en Vivo · Sábados',
    status: 'EN VIVO',
    badgeColor: 'emerald',
    instructor: 'Especialistas EduEval',
    studentsCount: 650,
    rating: '4.88/5',
    imageBg: 'linear-gradient(135deg, rgba(16, 185, 129, .2), rgba(5, 150, 105, .4))',
    techs: ['SQL', 'Git & GitHub', 'Docker', 'WebSockets'],
  },
]

const learningPaths = [
  {
    icon: Code2,
    title: 'Ruta Frontend con React',
    desc: 'Domina componentes, Hooks, estado global y estilos CSS modernos con proyectos reales.',
    coursesCount: '14 Cursos',
    color: 'yellow',
  },
  {
    icon: Laptop,
    title: 'Ruta Backend con Python & Django',
    desc: 'Construye APIs REST, autenticación JWT, modelos relacionales y evaluación automatizada.',
    coursesCount: '18 Cursos',
    color: 'cyan',
  },
  {
    icon: Layers,
    title: 'Ruta Base de Datos & SQL',
    desc: 'Aprende modelado de datos, consultas optimizadas, transacciones y esquemas en PostgreSQL.',
    coursesCount: '10 Cursos',
    color: 'emerald',
  },
  {
    icon: Zap,
    title: 'Ruta Tareas & Práctica Híbrida',
    desc: 'Resuelve desafíos de código con editor sin autocompletado y temporizadores Pomodoro.',
    coursesCount: '25 Desafíos',
    color: 'indigo',
  },
]

export default function LandingPage({ onEnter, demoMode }) {
  return (
    <main className="landing-page cf-inspired">
      {/* Top Banner Navigation */}
      <nav className="landing-nav" aria-label="Navegación principal">
        <a className="landing-brand" href="#inicio">
          <span className="brand-mark">
            <GraduationCap size={22} />
          </span>
          <strong>
            Edu<span>Eval</span> <small className="brand-badge-live">LIVE</small>
          </strong>
        </a>
        <div className="landing-links">
          <a href="#bootcamps">Bootcamps</a>
          <a href="#rutas">Rutas</a>
          <a href="#metodo">Método</a>
          <a href="#membresia">Membresía</a>
        </div>
        <div className="landing-nav-actions">
          <button className="landing-login" type="button" onClick={onEnter}>
            {demoMode ? 'Entrar a Demo' : 'Iniciar Sesión'} <ArrowRight size={15} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero" id="inicio">
        <div className="landing-hero-copy">
          <div className="live-ticker-badge">
            <Radio size={14} className="pulse-red" />
            <span>NUEVA EDICIÓN · Bootcamps en Vivo &amp; Aula Práctica</span>
          </div>

          <h1>
            Aprende a programar escribiendo <em>código real.</em>
          </h1>

          <p>
            Al estilo de las plataformas líderes como <b>Código Facilito</b>: bootcamps intensivos,
            rutas especializadas, tareas híbridas con temporizadores Pomodoro y un editor de código interactivo
            con feedback instantáneo.
          </p>

          <div className="landing-actions">
            <button className="landing-primary" type="button" onClick={onEnter}>
              <Sparkles size={16} /> {demoMode ? 'Explorar Aula Demo' : 'Comenzar Gratis'} <ArrowRight size={17} />
            </button>
            <a className="landing-text-link" href="#bootcamps">
              <Play size={14} /> Ver Bootcamps en Vivo
            </a>
          </div>

          <div className="landing-trust">
            <span>
              <CheckCircle2 size={15} /> Feedback automático en Python &amp; JS
            </span>
            <span>
              <CheckCircle2 size={15} /> Chat directo Docente-Estudiante
            </span>
            <span>
              <CheckCircle2 size={15} /> Certificados de dominio
            </span>
          </div>
        </div>

        {/* Hero Interactive Code Console Visual */}
        <div className="landing-hero-visual" aria-label="Vista previa del espacio de aprendizaje">
          <div className="landing-orbit orbit-one" />
          <div className="landing-orbit orbit-two" />

          <div className="landing-console">
            <div className="console-top">
              <span>
                <i /> <i /> <i />
              </span>
              <small>desafio_bootcamp.py</small>
              <span className="console-live">
                <Radio size={12} /> CLASE EN VIVO
              </span>
            </div>

            <div className="console-code">
              <p>
                <b className="code-purple">def</b> <b className="code-yellow">evaluar_solucion</b>(estudiante, codigo):
              </p>
              <p className="code-indent">
                <b className="code-purple">if</b> codigo.<b className="code-green">ejecutar_pruebas</b>():
              </p>
              <p className="code-indent-2">
                <b className="code-purple">return</b> <b className="code-str">"¡Aprobado! +120 XP"</b>
              </p>
              <p className="code-muted"># Ejecuta y recibe feedback en vivo de tu profesor</p>
            </div>

            <div className="console-result">
              <span>
                <CheckCircle2 size={15} /> 4 / 4 Casos de prueba pasaron
              </span>
              <b>+120 XP</b>
            </div>
          </div>

          <div className="landing-pixel-badge">
            <PixelSwap
              firstContent={
                <div className="click-prompt">
                  <Sparkles size={15} />
                  <span>Pasa para revelar reto</span>
                </div>
              }
              secondContent={
                <div className="found-message">
                  <CheckCircle2 size={15} />
                  <span>¡Nuevo Bootcamp Disponible!</span>
                </div>
              }
              pixelSize={64}
              gap={0}
              pixelRadius={4}
              pixelSpin={0}
              pixelScale={0.35}
              duration={1400}
              pixelDuration={450}
              pattern="random"
              randomness={0}
              fade
              trigger="hover"
            />
          </div>

          <div className="landing-float float-xp">
            <Sparkles size={14} /> +120 XP · Nivel 3
          </div>
          <div className="landing-float float-streak">
            <span>7</span>
            <div>
              <b>Racha Activa</b>
              <small> días consecutivos</small>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats Banner */}
      <section className="landing-proof" id="resultados">
        <div>
          <strong>+15,000</strong>
          <span>Estudiantes formados</span>
        </div>
        <div>
          <strong>4 Bootcamps</strong>
          <span>En vivo e intensivos</span>
        </div>
        <div>
          <strong>100%</strong>
          <span>Feedback de código real</span>
        </div>
        <div>
          <strong>Certificados</strong>
          <span>De dominio técnico</span>
        </div>
      </section>

      {/* Bootcamps en Vivo Section (Código Facilito Inspired) */}
      <section className="landing-section" id="bootcamps">
        <div className="landing-section-heading">
          <span className="landing-kicker">
            <Radio size={14} /> FORMACIÓN INTENSIVA
          </span>
          <h2>
            Bootcamps en Vivo con <em>Mentores Expertos.</em>
          </h2>
          <p>
            Clases semanales en directo, ejercicios prácticos corregidos al instante y acompañamiento continuo.
          </p>
        </div>

        <div className="bootcamps-grid">
          {bootcamps.map((bc) => (
            <article key={bc.id} className="bootcamp-card" style={{ background: bc.imageBg }}>
              <div className="bootcamp-card-header">
                <span className={`bootcamp-status-badge ${bc.badgeColor}`}>{bc.status}</span>
                <span className="bootcamp-rating">
                  <Star size={13} /> {bc.rating}
                </span>
              </div>

              <div className="bootcamp-card-main">
                <small className="bootcamp-category">{bc.category}</small>
                <h3>{bc.title}</h3>
                <p className="bootcamp-live-date">
                  <Clock size={13} /> {bc.liveDate} · {bc.duration}
                </p>

                <div className="bootcamp-techs">
                  {bc.techs.map((tech) => (
                    <span key={tech} className="tech-chip">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bootcamp-card-footer">
                <div className="instructor-info">
                  <span className="instructor-avatar">{bc.instructor[0]}</span>
                  <div>
                    <strong>{bc.instructor}</strong>
                    <small>{bc.studentsCount} estudiantes inscritos</small>
                  </div>
                </div>

                <button type="button" className="bootcamp-cta-button" onClick={onEnter}>
                  Ver Temario <ArrowRight size={14} />
                </button>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Learning Paths Section */}
      <section className="landing-section landing-paths" id="rutas">
        <div className="landing-section-heading">
          <span className="landing-kicker">
            <Layers size={14} /> RUTAS ESTRUCTURADAS
          </span>
          <h2>
            Elige tu especialización y avanza paso a <em>paso.</em>
          </h2>
          <p>Rutas guiadas desde los fundamentos hasta proyectos listos para producción.</p>
        </div>

        <div className="landing-path-grid">
          {learningPaths.map((path) => {
            const IconComponent = path.icon
            return (
              <article key={path.title} className={`landing-path-card ${path.color}`}>
                <div className="path-card-top">
                  <span className="landing-path-icon">
                    <IconComponent size={22} />
                  </span>
                  <span className="path-course-count">{path.coursesCount}</span>
                </div>
                <h3>{path.title}</h3>
                <p>{path.desc}</p>
                <button type="button" className="path-arrow-btn" onClick={onEnter}>
                  Explorar Ruta <ArrowRight size={16} />
                </button>
              </article>
            )
          })}
        </div>
      </section>

      {/* Methodology Section */}
      <section className="landing-section" id="metodo">
        <div className="landing-section-heading">
          <span className="landing-kicker">EL MÉTODO EDUEVAL</span>
          <h2>
            Una experiencia diseñada para que dejes de ver y empieces a <em>crear.</em>
          </h2>
        </div>

        <div className="landing-steps">
          <article>
            <span>01</span>
            <BookOpen size={24} />
            <h3>Aprende la Teoría en Clase</h3>
            <p>Accede a lecciones claras, guías de sintaxis y conceptos clave de programación.</p>
          </article>
          <article>
            <span>02</span>
            <Code2 size={24} />
            <h3>Escribe Código a Mano</h3>
            <p>Usa nuestro editor interactivo con numeración de líneas y resaltado de sintaxis sin autocompletado intrusivo.</p>
          </article>
          <article>
            <span>03</span>
            <MessageSquare size={24} />
            <h3>Resuelve Dudas en Directo</h3>
            <p>Chat en directo con tu profesor y comunidad para corregir errores al momento.</p>
          </article>
          <article>
            <span>04</span>
            <Award size={24} />
            <h3>Obtén tu Certificación</h3>
            <p>Supera las pruebas automáticas y descarga tus certificados de dominio acreditados.</p>
          </article>
        </div>
      </section>

      {/* Membership Banner */}
      <section className="landing-cta cf-membership-banner" id="membresia">
        <div className="membership-content">
          <div className="membership-badge">
            <Crown size={16} />
            <span>MEMBRESÍA PREMIUM EDUEVAL</span>
          </div>

          <h2>Acceso Ilimitado a Todos los Bootcamps y Cursos</h2>
          <p>
            Únete a nuestra comunidad de desarrolladores. Aprende Python, React, SQL, Git y mucho más con un solo pase.
          </p>

          <div className="membership-features">
            <span>
              <CheckCircle2 size={16} /> Acceso a clases grabadas y en vivo
            </span>
            <span>
              <CheckCircle2 size={16} /> Descarga de certificados ilimitada
            </span>
            <span>
              <CheckCircle2 size={16} /> Chat directo con docentes
            </span>
          </div>
        </div>

        <button className="landing-primary hero-gold-button" type="button" onClick={onEnter}>
          <Crown size={18} /> {demoMode ? 'Probar Membresía Demo' : 'Obtener Membresía Premium'} <ArrowRight size={17} />
        </button>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <div className="footer-top">
          <div className="footer-brand">
            <span className="brand-mark">
              <GraduationCap size={20} />
            </span>
            <strong>
              Edu<span>Eval</span>
            </strong>
            <p>Plataforma de aprendizaje técnico interactivo y bootcamps en vivo.</p>
          </div>

          <div className="footer-links-group">
            <div>
              <strong>Plataforma</strong>
              <a href="#bootcamps">Bootcamps</a>
              <a href="#rutas">Rutas de Aprendizaje</a>
              <a href="#metodo">Método EduEval</a>
            </div>
            <div>
              <strong>Comunidad</strong>
              <a href="#inicio">Chat en Directo</a>
              <a href="#inicio">Certificados</a>
              <a href="#inicio">Desafíos Híbridos</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>Inspirado en los mejores estándares de aprendizaje de código.</span>
          <span>© 2026 EduEval. Todos los derechos reservados.</span>
        </div>
      </footer>
    </main>
  )
}
