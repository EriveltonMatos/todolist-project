"use client"
import { deleteTask, fetchTasks, updateTask } from "@/services/taskService";
import { Task } from "@/types/Task";
import { useEffect, useState } from "react";

export default function TaskList() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
    const [sortBy, setSortBy] = useState<'priority' | 'name'>('priority');

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        setLoading(true);
        try {
            const data = await fetchTasks();
            setTasks(data);
        } catch (error) {
            console.error("Erro ao carregar tarefas:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (confirm("Tem certeza que deseja excluir esta tarefa?")) {
            try {
                const updatedTasks = await deleteTask(id);
                setTasks(updatedTasks);
                showNotification("Tarefa excluída com sucesso!");
            } catch (error) {
                console.error("Erro ao excluir tarefa:", error);
                showNotification("Erro ao excluir tarefa", "error");
            }
        }
    };

    const handleToggleComplete = async (task: Task) => {
        try {
            const updatedTasks = await updateTask({ ...task, realizado: !task.realizado });
            setTasks(updatedTasks);
            showNotification(task.realizado 
                ? "Tarefa marcada como pendente" 
                : "Tarefa concluída com sucesso!");
        } catch (error) {
            console.error("Erro ao atualizar tarefa:", error);
            showNotification("Erro ao atualizar tarefa", "error");
        }
    };

    const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
        const notification = document.createElement('div');
        notification.className = `fixed bottom-4 right-4 p-4 rounded-md shadow-lg ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white max-w-xs`;
        notification.textContent = message;
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.classList.add('opacity-0', 'transition-opacity', 'duration-500');
            setTimeout(() => document.body.removeChild(notification), 500);
        }, 3000);
    };

    const filteredTasks = tasks.filter(task => {
        if (filterStatus === 'all') return true;
        if (filterStatus === 'active') return !task.realizado;
        if (filterStatus === 'completed') return task.realizado;
        return true;
    });

    const sortedTasks = [...filteredTasks].sort((a, b) => {
        if (sortBy === 'priority') return b.prioridade - a.prioridade;
        return a.nome.localeCompare(b.nome);
    });

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.realizado).length;
    const pendingTasks = totalTasks - completedTasks;

    const getPriorityBadge = (priority: number) => {
        const colors = {
            1: "bg-blue-100 text-blue-800",
            2: "bg-green-100 text-green-800",
            3: "bg-yellow-100 text-yellow-800",
            4: "bg-orange-100 text-orange-800",
            5: "bg-red-100 text-red-800"
        };
        
        return (
            <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${colors[priority as keyof typeof colors] || colors[1]}`}>
                P{priority}
            </span>
        );
    };

    return (
        <div className="w-full max-w-4xl mx-auto my-8">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Minhas Tarefas</h2>
                    <div className="flex items-center space-x-2">
                        <div className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                            Total: {totalTasks}
                        </div>
                        <div className="bg-green-100 text-green-800 text-xs font-medium px-3 py-1 rounded-full">
                            Concluídas: {completedTasks}
                        </div>
                        <div className="bg-yellow-100 text-yellow-800 text-xs font-medium px-3 py-1 rounded-full">
                            Pendentes: {pendingTasks}
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap justify-between mb-6">
                    <div className="flex space-x-2 mb-2 sm:mb-0">
                        <button 
                            onClick={() => setFilterStatus('all')}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                                filterStatus === 'all' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Todas
                        </button>
                        <button 
                            onClick={() => setFilterStatus('active')}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                                filterStatus === 'active' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Pendentes
                        </button>
                        <button 
                            onClick={() => setFilterStatus('completed')}
                            className={`px-3 py-1 rounded-md text-sm font-medium ${
                                filterStatus === 'completed' 
                                    ? 'bg-blue-600 text-white' 
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }`}
                        >
                            Concluídas
                        </button>
                    </div>
                    <div className="flex items-center">
                        <label className="mr-2 text-sm text-gray-600">Ordenar por:</label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'priority' | 'name')}
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md p-1.5 focus:ring-blue-500 focus:border-blue-500"
                        >
                            <option value="priority">Prioridade</option>
                            <option value="name">Nome</option>
                        </select>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <>
                        {sortedTasks.length === 0 ? (
                            <div className="text-center py-12">
                                <p className="text-gray-500 text-lg">Nenhuma tarefa encontrada</p>
                                <p className="text-gray-400">Adicione novas tarefas para começar</p>
                            </div>
                        ) : (
                            <ul className="space-y-3">
                                {sortedTasks.map((task) => (
                                    <li 
                                        key={task.id} 
                                        className={`bg-gray-50 rounded-lg p-4 border-l-4 hover:bg-gray-100 transition-colors ${
                                            task.realizado 
                                                ? 'border-green-500' 
                                                : `${task.prioridade >= 4 ? 'border-red-500' : 'border-blue-500'}`
                                        }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h3 className={`font-medium ${task.realizado ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                                        {task.nome}
                                                    </h3>
                                                    {getPriorityBadge(task.prioridade)}
                                                </div>
                                                <p className={`text-sm ${task.realizado ? 'text-gray-400 line-through' : 'text-gray-600'}`}>
                                                    {task.descricao}
                                                </p>
                                            </div>
                                            <div className="flex space-x-2">
                                                <button 
                                                    onClick={() => handleToggleComplete(task)}
                                                    className={`px-3 py-1 rounded text-sm font-medium ${
                                                        task.realizado 
                                                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200' 
                                                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    }`}
                                                >
                                                    {task.realizado ? "Desfazer" : "Concluir"}
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(task.id!)}
                                                    className="px-3 py-1 bg-red-100 text-red-800 rounded text-sm font-medium hover:bg-red-200"
                                                >
                                                    Excluir
                                                </button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}