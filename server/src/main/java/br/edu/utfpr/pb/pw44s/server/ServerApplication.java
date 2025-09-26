package br.edu.utfpr.pb.pw44s.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication
public class ServerApplication {

    //https://github.com/viniciuspegorini/pw44s-2025-2

	public static void main(String[] args) {
		SpringApplication.run(ServerApplication.class, args);
	}

}
