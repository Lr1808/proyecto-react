import { useEffect, useState, useRef } from 'react';
import { Send } from 'lucide-react';
import { Message } from '../types';
import { useAuthStore } from '../store/useAuthStore';

export default function ChatPanel({ exerciseId }: { exerciseId: string }) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const ws = useRef<WebSocket | null>(null);
    const { user } = useAuthStore();

    useEffect(() => {
    // Reemplaza esto con la URL del WebSocket de Django
    ws.current = new WebSocket(`ws://localhost:8000/ws/chat/${exerciseId}/`);

    ws.current.onmessage = (event) => {
        const data = JSON.parse(event.data);
        setMessages((prev) => [...prev, data]);
    };

    return () => {
        ws.current?.close();
    };
    }, [exerciseId]);

    const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && ws.current) {
        ws.current.send(JSON.stringify({
        text: input,
        userId: user?.id,
        userName: user?.name,
        }));
        setInput('');
    }
    };

    return (
    <div className="flex flex-col h-full bg-orange-50">
        <div className="bg-orange-400 text-white font-bold py-2 px-4 shadow-sm">
        💬 Chat del Ejercicio
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        {messages.map((msg, idx) => (
            <div key={idx} className={`max-w-[80%] p-3 rounded-2xl ${msg.userId === user?.id ? 'bg-indigo-500 text-white self-end rounded-tr-none' : 'bg-white text-gray-800 border-2 border-orange-100 self-start rounded-tl-none'}`}>
            <span className="text-xs font-bold opacity-75 block mb-1">{msg.userName}</span>
            <p className="text-sm">{msg.text}</p>
            </div>
        ))}
        </div>

        <form onSubmit={sendMessage} className="p-3 bg-white border-t-2 border-orange-200 flex gap-2">
        <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Pide ayuda a tus compañeros..."
            className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none focus:ring-2 focus:ring-orange-400 transition-all"
        />
        <button type="submit" className="bg-orange-500 text-white p-2 rounded-full hover:bg-orange-600 transition-colors">
            <Send size={20} />
        </button>
        </form>
    </div>
    );
}