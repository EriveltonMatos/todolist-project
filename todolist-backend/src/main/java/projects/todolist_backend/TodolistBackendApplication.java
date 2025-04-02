package projects.todolist_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication()
public class TodolistBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(TodolistBackendApplication.class, args);
	}

}
