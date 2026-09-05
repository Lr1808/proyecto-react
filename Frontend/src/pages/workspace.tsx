import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { Play, CheckCircle, XCircle } from 'lucide-react';
import ChatPanel from '../components/ChatPanel';
import { useNavigate, useParams } from 'react-router-dom';
import { difficultyLabels, exercises, languageLabels } from '../data/exercises';
import type { SubmissionResult } from '../types';

export default function Workspace() {
        const { id } = useParams();
        const navigate = useNavigate();
        const exercise = exercises.find((item) => item.id === id) ?? exercises[0];
        const [code, setCode] = useState(exercise.initialCode);
        const [results, setResults] = useState<SubmissionResult[] | null>(null);
        const [isEvaluating, setIsEvaluating] = useState(false);

    const handleRunCode = () => {
    setIsEvaluating(true);
    // Simulación de llamada a la API de Django
    setTimeout(() => {
        setResults([
                ...exercise.testCases.filter((test) => !test.isHidden).map((test, index) => ({
                    passed: index === 0,
                    output: index === 0 ? test.expectedOutput : 'Salida distinta a la esperada',
                    executionTime: 12 + index * 9,
                    testCaseId: test.id,
                }))
        ]);
        setIsEvaluating(false);
    }, 1000);
    };

    return (
    <div className="flex h-screen bg-sky-50 font-sans">
        
      {/* PANEL IZQUIERDO: Enunciado y Chat */}
        <div className="w-1/2 flex flex-col border-r-4 border-indigo-200">
        
        {/* Enunciado */}
        <div className="flex-1 p-6 overflow-y-auto bg-white rounded-br-3xl shadow-sm mb-2">
            <button onClick={() => navigate('/dashboard')} className="text-indigo-600 font-bold mb-5 hover:text-indigo-800">← Volver a retos</button>
            <h1 className="text-4xl font-extrabold text-indigo-700 mb-4">{exercise.title}</h1>
            <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-yellow-400 text-yellow-900 font-bold rounded-full text-sm">{difficultyLabels[exercise.difficulty]}</span>
            <span className="px-3 py-1 bg-green-400 text-green-900 font-bold rounded-full text-sm">+{exercise.points} Pts</span>
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 font-bold rounded-full text-sm">{languageLabels[exercise.language]}</span>
            </div>
            <p className="text-lg text-gray-700 leading-relaxed">
            {exercise.description}
            </p>
            
            <h3 className="text-xl font-bold text-indigo-600 mt-8 mb-2">Casos de Prueba Públicos</h3>
                        <div className="space-y-3">
                            {exercise.testCases.filter((test) => !test.isHidden).map((test, index) => (
                                <div key={test.id} className="bg-indigo-50 p-4 rounded-xl border-2 border-indigo-100">
                                    <p className="text-xs font-bold text-indigo-500 uppercase mb-1">Caso público {index + 1}</p>
                                    <p className="font-mono text-indigo-900">Entrada: {test.input}</p>
                                    <p className="font-mono text-indigo-900">Salida esperada: {test.expectedOutput}</p>
                                </div>
                            ))}
                        </div>
        </div>

        {/* Chat de Dudas */}
        <div className="h-1/3 bg-white border-t-4 border-pink-200">
            <ChatPanel exerciseId="ex-123" />
        </div>
        </div>

      {/* PANEL DERECHO: Editor y Consola */}
        <div className="w-1/2 flex flex-col">
        
        {/* Editor de Código */}
        <div className="flex-1 relative">
          {/* El theme 'light' de Monaco encaja con el diseño vivo */}
            <Editor
            height="100%"
            language={exercise.language === 'cpp' ? 'cpp' : exercise.language}
            theme="light"
            value={code}
            onChange={(val) => setCode(val || '')}
            options={{
                minimap: { enabled: false },
                fontSize: 16,
                padding: { top: 20 }
            }}
            />
            <button 
            onClick={handleRunCode}
            disabled={isEvaluating}
            className="absolute bottom-6 right-6 flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-full font-bold shadow-lg shadow-emerald-200 transition-transform active:scale-95 disabled:opacity-50"
            >
            <Play size={20} fill="currentColor" />
            {isEvaluating ? 'Evaluando...' : 'Ejecutar Código'}
            </button>
        </div>

        {/* Consola de Evaluación */}
        <div className="h-64 bg-slate-100 border-t-4 border-slate-300 p-4 overflow-y-auto">
            <h3 className="font-bold text-slate-700 mb-3 uppercase tracking-wider">Resultados de Evaluación</h3>
            
            {!results && <p className="text-slate-500 italic">Ejecuta tu código para ver los resultados aquí.</p>}
            
            {results && results.map((res, i) => (
            <div key={i} className={`flex items-center gap-3 p-3 mb-2 rounded-lg border-2 ${res.passed ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                {res.passed ? <CheckCircle className="text-green-500" /> : <XCircle className="text-red-500" />}
                <div>
                <p className={`font-bold ${res.passed ? 'text-green-800' : 'text-red-800'}`}>
                    Caso de Prueba #{i + 1}: {res.passed ? 'Aprobado' : 'Falló'}
                </p>
                {!res.passed && <p className="text-sm font-mono text-red-600">Salida obtenida: {res.output}</p>}
                </div>
                <span className="ml-auto text-sm text-slate-400">{res.executionTime}ms</span>
            </div>
            ))}
        </div>
        </div>
    </div>
    );
}