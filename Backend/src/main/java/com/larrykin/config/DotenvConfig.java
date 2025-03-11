package com.larrykin.config;

import io.github.cdimascio.dotenv.Dotenv;
import jakarta.annotation.PostConstruct;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DotenvConfig {

    @PostConstruct
    public void loadEnv() {
        Dotenv dotenv = Dotenv.configure()
                .directory("Backend")
                .ignoreIfMalformed()
                .ignoreIfMissing()
                .load();

        // Set environment variables as system properties for Spring to use
        dotenv.entries().forEach(e ->
                System.setProperty(e.getKey(), e.getValue())
        );

        String mongoUri = dotenv.get("MONGODB_URI");
        String jwt_secret = dotenv.get("JWT_SECRET");
        System.out.println(jwt_secret);
        System.out.println(mongoUri);
    }
}