package com.apitable.shared.config;

import cn.hutool.core.util.RandomUtil;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import java.util.HashMap;
import java.util.Map;
import org.springdoc.core.customizers.GlobalOpenApiCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * SpringDoc Config.
 */
@Configuration
public class SpringDocConfig {

    /**
     * customizer global open api order by tag name.
     *
     * @return GlobalOpenApiCustomizer
     */
    @Bean
    public GlobalOpenApiCustomizer orderGlobalOpenApiCustomizer() {
        return openApi -> {
            if (openApi.getTags() != null) {
                openApi.getTags().forEach(tag -> {
                    Map<String, Object> map = new HashMap<>();
                    map.put("x-order", RandomUtil.randomInt(0, 100));
                    tag.setExtensions(map);
                });
            }
            if (openApi.getPaths() != null) {
                openApi.getPaths().addExtension("x-abb", RandomUtil.randomInt(1, 100));
            }
        };
    }

    /**
     * open api document config.
     *
     * @return OpenAPI
     */
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("APITable API")
                .version("v1")
                .contact(
                    new Contact().name("APITable")
                        .email("dev@apitable.com")
                        .url("https://aitable.ai")
                )
                .description("APITable API Document")
                .termsOfService("https://aitable.ai")
                .license(new License().name("AGPL-3.0 license")
                    .url("https://github.com/apitable/apitable/blob/develop/LICENSE")));
    }
}
