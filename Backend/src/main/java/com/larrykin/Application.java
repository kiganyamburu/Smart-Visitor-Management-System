package com.larrykin;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;

//@EnableMongoRepositories(basePackages = "com.larrykin.repositories")
@SpringBootApplication(exclude =  {DataSourceAutoConfiguration.class })
@EnableMongoAuditing
public class Application {

	public static void main(String[] args) {
		SpringApplication.run(Application.class, args);
	}

}
