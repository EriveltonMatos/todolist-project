import { Task } from "@/types/Task";
import api from "./api";


export const fetchTasks = async (): Promise<Task[]> => {
    const response = await api.get("/todos");
    return response.data;
};

export const addTask = async (task: Task): Promise<Task[]> => {
    const response = await api.post("/todos", task)
    return response.data;
}

export const updateTask = async (task: Task): Promise<Task[]> => {
    const response = await api.put("/todos", task);
    return response.data;
}

export const deleteTask = async (id: number): Promise<Task[]> => {
    const response = await api.delete(`/todos/${id}`)
    return response.data;
}