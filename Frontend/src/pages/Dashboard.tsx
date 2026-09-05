import { useAuthStore } from '../store/useAuthStore';
import { Flame, Trophy, Medal, Code2, ArrowRight, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { difficultyLabels, exercises, languageLabels } from '../data/exercises';

export default function Dashboard() {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [languageFilter, setLanguageFilter] = useState('all');

    const visibleExercises = exercises.filter((exercise) => (
        languageFilter === 'all' || exercise.language === languageFilter
    ));

  // Mock data para el ranking (luego vendrá de Django)
    const leaderboard = [
    { rank: 1, name: 'Ana García', score: 3200, avatar: '👩‍💻' },
    { rank: 2, name: 'Carlos Dev', score: 2850, avatar: '👨‍💻' },
    { rank: 3, name: user?.name, score: user?.score, avatar: '😎' },
    ];

    return (
    <div className="min-h-screen bg-lime-50 p-8 font-sans">
        <header className="flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border-b-4 border-lime-200 mb-8">
        <h1 className="text-3xl font-extrabold text-lime-700">Dashboard de {user?.name}</h1>
        <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full border-2 border-orange-300">
            <Flame className="text-orange-500 animate-pulse" fill="currentColor" />
            <span className="font-bold text-orange-700 text-lg">{user?.streakDays} Días</span>
            </div>
            <div className="flex items-center gap-2 bg-yellow-100 px-4 py-2 rounded-full border-2 border-yellow-300">
            <Trophy className="text-yellow-500" fill="currentColor" />
            <span className="font-bold text-yellow-700 text-lg">{user?.score} Pts</span>
            </div>
        </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Columna Izquierda: Ejercicios y Medallas */}
        <div className="lg:col-span-2 flex flex-col gap-8">
                        <section className="bg-white p-6 rounded-3xl shadow-sm border-2 border-emerald-100">
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-5">
                            <h2 className="text-2xl font-bold text-emerald-800 flex items-center gap-2">
                                    <Code2 className="text-emerald-500" /> Biblioteca de retos
                            </h2>
                            <label className="flex items-center gap-2 bg-emerald-50 px-3 py-2 rounded-xl text-emerald-800 font-bold text-sm">
                                <Filter size={16} />
                                <span className="sr-only">Filtrar por lenguaje</span>
                                <select value={languageFilter} onChange={(event) => setLanguageFilter(event.target.value)} className="bg-transparent outline-none cursor-pointer">
                                    <option value="all">Todos los lenguajes</option>
                                    {Object.entries(languageLabels).map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                                </select>
                            </label>
                        </div>
                        <div className="grid gap-4">
                            {visibleExercises.map((exercise) => (
                                <article key={exercise.id} className="bg-emerald-50 p-5 rounded-2xl border border-emerald-200 flex flex-wrap justify-between items-center gap-4">
                                    <div>
                                        <div className="flex flex-wrap gap-2 mb-2">
                                            <span className="px-2 py-1 rounded-full bg-white text-emerald-700 text-xs font-bold">{languageLabels[exercise.language]}</span>
                                            <span className="px-2 py-1 rounded-full bg-lime-200 text-lime-900 text-xs font-bold">{difficultyLabels[exercise.difficulty]}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-emerald-900">{exercise.title}</h3>
                                        <p className="text-emerald-700 mt-1 max-w-xl">{exercise.description}</p>
                                        <p className="text-emerald-800 text-sm font-bold mt-2">+{exercise.points} puntos · {exercise.testCases.filter((test) => !test.isHidden).length} casos públicos</p>
                                    </div>
                                    <button aria-label={`Resolver ${exercise.title}`} onClick={() => navigate(`/exercise/${exercise.id}`)} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-5 rounded-full shadow-lg shadow-emerald-200 transition-transform active:scale-95">
                                        Resolver <ArrowRight size={18} />
                                    </button>
                                </article>
                            ))}
                        </div>
            </section>

            <section className="bg-white p-6 rounded-3xl shadow-sm border-2 border-purple-100">
            <h2 className="text-2xl font-bold text-purple-800 mb-4">Mis Medallas</h2>
            <div className="flex gap-4">
                {user?.badges.map((badge, idx) => (
                <div key={idx} className="flex flex-col items-center gap-2 bg-purple-50 p-4 rounded-2xl border border-purple-200">
                    <Medal size={40} className="text-purple-500" />
                    <span className="font-bold text-purple-700 text-sm">{badge}</span>
                </div>
                ))}
            </div>
            </section>
        </div>

        {/* Columna Derecha: Leaderboard */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border-2 border-blue-100 h-fit">
            <h2 className="text-2xl font-bold text-blue-800 mb-6 text-center">Top Hackers 🏆</h2>
            <div className="flex flex-col gap-3">
            {leaderboard.map((student, idx) => (
                <div key={idx} className={`flex items-center gap-4 p-4 rounded-2xl border-2 transition-all ${student.name === user?.name ? 'bg-blue-50 border-blue-400 scale-105 shadow-md' : 'bg-gray-50 border-gray-100'}`}>
                <span className="text-xl font-black text-gray-400 w-6">#{student.rank}</span>
                <span className="text-3xl">{student.avatar}</span>
                <div className="flex-1">
                    <p className="font-bold text-gray-800">{student.name}</p>
                    <p className="text-sm font-bold text-blue-600">{student.score} Pts</p>
                </div>
                </div>
            ))}
            </div>
        </div>
        </div>
    </div>
    );
}