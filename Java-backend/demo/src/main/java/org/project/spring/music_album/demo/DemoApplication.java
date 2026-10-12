package org.project.spring.music_album.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
// Classe iniziale: avvia Spring Boot e la scansione automatica di controller, servizi e repository.
public class DemoApplication {

	// SpringApplication configura il contesto e avvia il server HTTP dell'applicazione.
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

}
