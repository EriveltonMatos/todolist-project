"use client"

import { addTask } from "@/services/taskService";
import { Task } from "@/types/Task";
import { useState } from "react";

export default function TaskForm() {
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [prioridade, setPrioridade] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!nome.trim() || !descricao.trim()) return;

        setIsLoading(true);
        try {
            const newTask: Task = {
                nome, 
                descricao, 
                realizado: false, 
                prioridade,
                id: null 
            };
            await addTask(newTask);
            
            showNotification("Tarefa adicionada com sucesso!");
            
            setNome("");
            setDescricao("");
            setPrioridade(1);
        } catch (error) {
            console.error("Erro ao adicionar tarefa:", error);
            showNotification("Erro ao adicionar tarefa", "error");
        } finally {
            setIsLoading(false);
        }
    };
    
    // Função para mostrar notificações
    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white max-w-xs z-50`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
            setTimeout(() => document.body.removeChild(notification), 500);
        }, 3000);
    };

    return (
        <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md p-6 my-4">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Nova Tarefa</h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                    <label htmlFor="nome" className="block text-sm font-medium text-gray-700">
                        Nome da Tarefa
                    </label>
                    <input 
                        id="nome"
                        type="text" 
                        placeholder="Digite o nome da tarefa" 
                        value={nome} 
                        onChange={(e) => setNome(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="descricao" className="block text-sm font-medium text-gray-700">
                        Descrição
                    </label>
                    <textarea 
                        id="descricao"
                        placeholder="Descreva os detalhes da tarefa" 
                        value={descricao} 
                        onChange={(e) => setDescricao(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition h-32 resize-none"
                        required
                    />
                </div>
                
                <div className="space-y-2">
                    <label htmlFor="prioridade" className="block text-sm font-medium text-gray-700">
                        Prioridade (1-5)
                    </label>
                    <div className="flex items-center space-x-2">
                        <input 
                            id="prioridade"
                            type="range" 
                            min="1" 
                            max="5" 
                            value={prioridade} 
                            onChange={(e) => setPrioridade(Number(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                        />
                        <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold">
                            {prioridade}
                        </span>
                    </div>
                </div>
                
                <button 
                    type="submit" 
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm transition duration-200 flex items-center justify-center"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <span>Adicionando...</span>
                    ) : (
                        <span>Adicionar Tarefa</span>
                    )}
                </button>
            </form>
        </div>
    )
}