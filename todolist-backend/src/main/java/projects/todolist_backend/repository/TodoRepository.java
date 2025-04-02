package projects.todolist_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import projects.todolist_backend.entities.Todo;

@Repository
public interface TodoRepository extends JpaRepository<Todo, Long> {
}
