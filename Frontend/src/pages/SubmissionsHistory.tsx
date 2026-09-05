import { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, Clock, Code } from 'lucide-react';
import { apiClient } from '../api/client';

interface SubmissionItem {
    id: string;
    exerciseTitle: string;
    status: 'ACCEPTED' | 'FAILED' | 'ERROR';
    executionTime: number;
    createdAt: string;
    codeSnippet: string;
}

export default function SubmissionsHistory() {
    const [submissions, setSubmissions] = useState<SubmissionItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
    // Petición real al backend de Django
    apiClient.get('/submissions/')
        .then((res) => {
        setSubmissions(res.data);
        setLoading(false);
        })
        .catch(() => {
        // Datos de respaldo (mock) si el backend de tu compañero aún está levantando los endpoints
        setSubmissions([
            { id: 'sub-1', exerciseTitle: 'Suma de Arreglos', status: 'ACCEPTED', executionTime: 14, createdAt: '2026-06-06 14:20', codeSnippet: 'function solve(arr) { return arr.reduce((a, b) => a + b, 0); }' },
            { id: 'sub-2', exerciseTitle: 'Invertir Cadena', status: 'FAILED', executionTime: 45, createdAt: '2026-06-05 10:15', codeSnippet: 'function solve(str) { return str; }' },
        ]);
        setLoading(false);
        });
    }, []);

    if (loading) {
    return (
        <div className="min-h-screen bg-violet-50 flex items-center justify-center font-sans">
        <p className="text-violet-600 font-bold text-xl animate-bounce">Cargando tu historial estelar...</p>
        </div>
    );
    }

    return (
    <div className="min-h-screen bg-violet-50 p-8 font-sans">
        <div className="max-w-4xl mx-auto">
        <header className="mb-8">
            <h1 className="text-4xl font-extrabold text-violet-800">📜 Historial de Entregas</h1>
            <p className="text-violet-600 mt-2 font-medium">Revisa el rendimiento y código de tus envíos pasados.</p>
        </header>

        <div className="flex flex-col gap-4">
            {submissions.map((sub) => {
            const isSuccess = sub.status === 'ACCEPTED';
            return (
                <div 
                key={sub.id} 
                className={`p-6 rounded-3xl border-2 bg-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 transition-all hover:shadow-md ${isSuccess ? 'border-emerald-200' : 'border-rose-200'}`}
                >
                <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-2xl ${isSuccess ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                    {isSuccess ? <CheckCircle2 size={28} /> : <XCircle size={28} />}
                    </div>
                    <div>
                    <h3 className="text-xl font-bold text-gray-800">{sub.exerciseTitle}</h3>
                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                        <span className="flex items-center gap-1"><Clock size={16} /> {sub.createdAt}</span>
                        <span className="flex items-center gap-1"><Code size={16} /> {sub.executionTime} ms</span>
                    </div>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                    <span className={`px-4 py-1.5 rounded-full font-extrabold text-xs tracking-wider uppercase ${isSuccess ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                    {sub.status}
                    </span>
                </div>
                </div>
            );
            })}
        </div>
        </div>
    </div>
    );
}