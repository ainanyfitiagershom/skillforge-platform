package com.tsarajoro.skillforge;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class SkillforgeApplication {

    public static void main(String[] args) {
        SpringApplication.run(SkillforgeApplication.class, args);
    }
}
