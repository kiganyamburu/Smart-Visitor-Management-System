package com.larrykin;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.beans.factory.annotation.Value;

public class EnvTest {
//    @Value("${spring.data.mongodb.uri}")
//    private static String mongoUri;

    public static void main(String[] args) {
        Dotenv dotenv = Dotenv.configure()
                .directory("Backend")  // Adjust this path as needed
                .load();

        String mongoUri = dotenv.get("MONGODB_URI");
        System.out.println(mongoUri);    }
}
