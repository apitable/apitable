package com.vikadata.aider;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class AiderApplication {

    public static void main(String[] args) {
        SpringApplication.run(AiderApplication.class, args);
    }
}
