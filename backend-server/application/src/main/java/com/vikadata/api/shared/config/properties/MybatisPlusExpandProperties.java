package com.vikadata.api.shared.config.properties;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * mybatis plus extend properties
 * @author Shawn Deng
 */
@Data
@ConfigurationProperties(prefix = "vikadata.mybatis-plus")
public class MybatisPlusExpandProperties {

    private Plugin plugin = new Plugin();

    @Getter
    @Setter
    public static class Plugin {

        /**
         * Whether to enable garbage sql interception only unit test，default false
         */
        private Boolean illegalSql = Boolean.FALSE;

        /**
         * whether to enable sql block attack only unit test, default false
         */
        private Boolean blockAttack = Boolean.FALSE;
    }
}
