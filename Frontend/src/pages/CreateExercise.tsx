import { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import { TestCase } from '../types';

export default function CreateExercise() {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [initialCode, setInitialCode] = useState('');
    const [testCases, setTestCases] = useState<Omit<TestCase, 'id'>[]>([
    { input: '', expectedOutput: '', isHidden: false }
    ]);

    const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', isHidden: false }]);
    };

    const handleRemoveTestCase = (index: number) => {
    setTestCases(testCases.filter((_, i) => i !== index));
    };

    const handleTestCaseChange = (index: number, field: keyof TestCase, value: string | boolean) => {
    const newTestCases = [...testCases];
    newTestCases[index] = { ...newTestCases[index], [field]: value };
    setTestCases(newTestCases);
    };

    const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newExercise = { title, description, initialCode, testCases };
    console.log('Enviando a Django:', newExercise);
    // Aquí llamarías a apiClient.post('/exercises/', newExercise)
    alert('¡Ejercicio creado con éxito!');
    };

    return (
    <div className="min-h-screen bg-amber-50 p-8 font-sans">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded-3xl shadow-sm border-t-8 border-amber-400">
        <h1 className="text-3xl font-extrabold text-amber-800 mb-8">🛠️ Crear Nuevo Ejercicio</h1>
        
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            
          {/* Información General */}
            <div className="flex flex-col gap-2">
            <label className="font-bold text-amber-900">Título del Ejercicio</label>
            <input 
            required
            value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="px-4 py-3 bg-amber-50 rounded-xl border-2 border-amber-200 outline-none focus:border-amber-500 transition-colors" 
                placeholder="Ej: Suma de Matrices" 
            />
            </div>

            <div className="flex flex-col gap-2">
            <label className="font-bold text-amber-900">Descripción (Soporta Markdown)</label>
            <textarea 
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="px-4 py-3 bg-amber-50 rounded-xl border-2 border-amber-200 outline-none focus:border-amber-500 transition-colors min-h-[120px]" 
                placeholder="Explica detalladamente lo que el alumno debe resolver..." 
            />
            </div>

            <div className="flex flex-col gap-2">
            <label className="font-bold text-amber-900">Código Inicial (Plantilla para el alumno)</label>
            <textarea 
                value={initialCode}
                onChange={(e) => setInitialCode(e.target.value)}
                className="px-4 py-3 bg-gray-900 text-green-400 font-mono rounded-xl border-2 border-gray-800 outline-none min-h-[150px]" 
                placeholder="function solve() { ... }" 
            />
            </div>

          {/* Sección de Casos de Prueba */}
            <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-amber-800">Casos de Prueba (Test Cases)</h2>
                <button 
                type="button" 
                onClick={handleAddTestCase}
                className="flex items-center gap-2 bg-amber-100 hover:bg-amber-200 text-amber-700 font-bold px-4 py-2 rounded-full border-2 border-amber-300 transition-colors"
                >
                <Plus size={18} /> Agregar Caso
                </button>
            </div>

            <div className="flex flex-col gap-4">
                {testCases.map((tc, index) => (
                <div key={index} className="flex gap-4 items-start bg-amber-50 p-4 rounded-2xl border-2 border-amber-200 relative group">
                    <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-bold text-amber-800">Entrada (Input)</label>
                    <input 
                        required
                        value={tc.input}
                        onChange={(e) => handleTestCaseChange(index, 'input', e.target.value)}
                        className="px-3 py-2 bg-white rounded-lg border border-amber-300 font-mono text-sm outline-none" 
                        placeholder="Ej: [1, 2, 3]" 
                    />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                    <label className="text-sm font-bold text-amber-800">Salida Esperada</label>
                    <input 
                        required
                        value={tc.expectedOutput}
                        onChange={(e) => handleTestCaseChange(index, 'expectedOutput', e.target.value)}
                        className="px-3 py-2 bg-white rounded-lg border border-amber-300 font-mono text-sm outline-none" 
                        placeholder="Ej: 6" 
                    />
                    </div>
                    <div className="flex flex-col gap-2 items-center justify-center pt-6">
                    <label className="text-xs font-bold text-amber-700">¿Oculto?</label>
                    <input 
                        type="checkbox" 
                        checked={tc.isHidden}
                        onChange={(e) => handleTestCaseChange(index, 'isHidden', e.target.checked)}
                        className="w-5 h-5 accent-amber-500"
                    />
                    </div>
                    {testCases.length > 1 && (
                    <button 
                        type="button" 
                        onClick={() => handleRemoveTestCase(index)}
                        className="absolute -right-3 -top-3 bg-red-100 text-red-600 p-2 rounded-full border-2 border-red-200 hover:bg-red-500 hover:text-white transition-colors opacity-0 group-hover:opacity-100"
                    >
                        <Trash2 size={16} />
                    </button>
                    )}
                </div>
                ))}
            </div>
            </div>

            <button 
            type="submit" 
            className="mt-8 flex justify-center items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-black text-lg py-4 rounded-xl shadow-lg transform transition active:scale-95"
            >
            <Save size={24} /> Guardar Ejercicio y Publicar
            </button>
        </form>
        </div>
    </div>
    );
}