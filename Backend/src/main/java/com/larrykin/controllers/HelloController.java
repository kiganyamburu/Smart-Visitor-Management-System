package com.larrykin.controllers;

import io.swagger.v3.oas.annotations.Hidden;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@Tag(name= "Hello", description = "Hello API")
@Hidden
public class HelloController {

    @GetMapping("/")
    private String helloWorld() {
        return "Hello World!";
    }
}
