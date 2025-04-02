import TaskForm from "./todos/components/TaskForm";
import TaskList from "./todos/components/TaskList";

export default function Home() {
  return (
    <div>
    <TaskList />
      <TaskForm />
      </div>
  );
}
