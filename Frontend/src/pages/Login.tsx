import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { Role } from '../types';

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [role, setRole] = useState<Role>('STUDENT');
    const navigate = useNavigate();
    const login = useAuthStore((state) => state.login);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        login({
            id: '1',
            name: 'Usuario Demo',
            email: 'demo@codegrade.com',
            role,
            streakDays: 5,
            score: 1250,
            badges: ['First Blood', 'Bug Hunter']
        });

        navigate(role === 'TEACHER' ? '/exercise/create' : '/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.22),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(96,165,250,0.2),_transparent_26%),radial-gradient(circle_at_bottom_left,_rgba(52,211,153,0.22),_transparent_24%),linear-gradient(135deg,_#fefce8_0%,_#ecfeff_38%,_#f5f3ff_72%,_#fdf2f8_100%)] p-4 sm:p-6 lg:p-10">
            <div className="w-full max-w-5xl overflow-hidden rounded-[32px] border border-violet-200/80 bg-white/75 shadow-[0_25px_70px_rgba(79,70,229,0.18)] backdrop-blur-xl">
                <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
                    <div className="relative hidden overflow-hidden bg-gradient-to-br from-violet-600 via-indigo-500 to-cyan-500 p-8 lg:flex lg:flex-col lg:justify-between">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.25),_transparent_30%)]" />

                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1 text-[10px] font-black uppercase tracking-[0.3em] text-white/90 backdrop-blur-sm">
                                CodeGrade
                            </div>
                        </div>

                        <div className="relative z-10 space-y-6">
                            <div>
                                <p className="mb-3 text-sm font-bold uppercase tracking-[0.3em] text-violet-100/90">Aprende + crece</p>
                                <h1 className="max-w-md text-4xl font-black leading-tight text-white">
                                    Tu campus digital para codear con confianza.
                                </h1>
                            </div>

                            <div className="space-y-4 text-sm text-violet-50/90">
                                <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg">🚀</div>
                                    <div>
                                        <p className="font-black text-white">Proyectos reales</p>
                                        <p className="text-violet-50/80">Desafíos de programación para universidad y trabajo.</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 rounded-2xl border border-white/20 bg-white/10 p-3 backdrop-blur-sm">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg">📊</div>
                                    <div>
                                        <p className="font-black text-white">Seguimiento claro</p>
                                        <p className="text-violet-50/80">Resultados, estadísticas y mejora constante.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="relative z-10 text-sm text-violet-50/85">
                            Una comunidad activa de estudiantes, docentes y mentores.
                        </div>
                    </div>

                    <div className="bg-white p-6 sm:p-8 lg:p-10">
                        <div className="mb-8 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.28em] text-indigo-600">Acceso</p>
                                <h2 className="mt-2 text-3xl font-black text-slate-800">
                                    {isLogin ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
                                </h2>
                            </div>
                            <div className="rounded-full border border-indigo-200 bg-indigo-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-indigo-700">
                                {isLogin ? 'Login' : 'Registro'}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {!isLogin && (
                                <div>
                                    <label className="mb-2 block text-sm font-bold text-slate-700">Nombre completo</label>
                                    <input
                                        type="text"
                                        placeholder="Tu nombre completo"
                                        required
                                        className="w-full rounded-2xl border border-violet-200 bg-violet-50/70 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-indigo-400 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                                    />
                                </div>
                            )}

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">Correo electrónico</label>
                                <input
                                    type="email"
                                    placeholder="correo@ejemplo.com"
                                    required
                                    className="w-full rounded-2xl border border-violet-200 bg-violet-50/70 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-pink-400 focus:bg-white focus:ring-4 focus:ring-pink-100"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-bold text-slate-700">Contraseña</label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    required
                                    className="w-full rounded-2xl border border-violet-200 bg-violet-50/70 px-4 py-3 text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-cyan-400 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                                />
                            </div>

                            {!isLogin && (
                                <div>
                                    <p className="mb-2 text-sm font-bold text-slate-700">Selecciona tu perfil</p>
                                    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-slate-50 p-2 shadow-inner shadow-slate-100">
                                        <button
                                            type="button"
                                            onClick={() => setRole('STUDENT')}
                                            className={`rounded-xl border px-3 py-2 text-sm font-black transition ${role === 'STUDENT' ? 'border-cyan-400 bg-cyan-100 text-cyan-700 shadow-[0_0_0_2px_rgba(34,211,238,0.15)]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                                        >
                                            Alumno
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setRole('TEACHER')}
                                            className={`rounded-xl border px-3 py-2 text-sm font-black transition ${role === 'TEACHER' ? 'border-pink-400 bg-pink-100 text-pink-700 shadow-[0_0_0_2px_rgba(236,72,153,0.15)]' : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300'}`}
                                        >
                                            Profesor
                                        </button>
                                    </div>
                                </div>
                            )}

                            <button
                                type="submit"
                                className="mt-2 w-full rounded-2xl bg-gradient-to-r from-violet-500 via-indigo-500 to-cyan-500 px-5 py-3.5 text-base font-black text-white shadow-[0_15px_28px_rgba(99,102,241,0.28)] transition hover:brightness-105 active:scale-[0.99]"
                            >
                                {isLogin ? 'Entrar al Dojo' : 'Crear mi Cuenta'}
                            </button>
                        </form>

                        <p className="mt-6 text-center text-sm text-slate-500">
                            {isLogin ? '¿No tienes cuenta?' : '¿Ya eres miembro?'}
                            <button
                                type="button"
                                onClick={() => setIsLogin(!isLogin)}
                                className="ml-2 font-black text-indigo-600 transition hover:text-indigo-500"
                            >
                                {isLogin ? 'Regístrate' : 'Inicia sesión'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}