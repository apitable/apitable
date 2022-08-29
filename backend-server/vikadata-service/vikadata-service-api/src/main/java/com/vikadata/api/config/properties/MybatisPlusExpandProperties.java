package com.vikadata.api.config.properties;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import org.springframework.boot.context.properties.ConfigurationProperties;

/**
 * mybatis plus 扩展配置
 * @author Shawn Deng
 * @date 2022-03-29 21:52:18
 */
@Data
@ConfigurationProperties(prefix = "vikadata.mybatis-plus")
public class MybatisPlusExpandProperties {

    private Plugin plugin = new Plugin();

    @Getter
    @Setter
    public static class Plugin {

        /**
         * 是否开启垃圾sql拦截，在SQL性能优化阶段，先默认设置false
         */
        private Boolean illegalSql = Boolean.FALSE;

        /**
         * 是否开启攻击 SQL 阻断解析器
         */
        private Boolean blockAttack = Boolean.FALSE;

    }
}
