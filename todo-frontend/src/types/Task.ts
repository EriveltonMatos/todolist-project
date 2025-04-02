// types/Task.ts
export interface Task {
    id: number | null; // Use null para novos registros
    nome: string;
    descricao: string;
    realizado: boolean;
    prioridade: number;
  }