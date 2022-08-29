package com.vikadata.api.config;

import com.baomidou.mybatisplus.annotation.FieldStrategy;
import com.baomidou.mybatisplus.autoconfigure.ConfigurationCustomizer;
import com.baomidou.mybatisplus.autoconfigure.MybatisPlusPropertiesCustomizer;
import com.baomidou.mybatisplus.extension.MybatisMapWrapperFactory;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.BlockAttackInnerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.IllegalSQLInnerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.OptimisticLockerInnerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import lombok.extern.slf4j.Slf4j;
import org.mybatis.spring.annotation.MapperScan;

import com.vikadata.api.component.ExpandSqlInjector;
import com.vikadata.api.config.properties.MybatisPlusExpandProperties;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * <p>
 * Mybatis-plus 配置
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/9/16 16:16
 */
@Configuration(proxyBeanMethods = false)
@EnableTransactionManagement
@MapperScan(basePackages = { "com.vikadata.api.modular.*.mapper" })
@Slf4j
public class MybatisPlusConfig {

    private final MybatisPlusExpandProperties properties;

    public MybatisPlusConfig(MybatisPlusExpandProperties properties) {
        this.properties = properties;
    }

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        // 分页拦截器
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor());
        // 乐观锁插件
        interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());
        if (properties.getPlugin().getIllegalSql()) {
            // SQL规范插件，后期可定制化
            interceptor.addInnerInterceptor(new IllegalSQLInnerInterceptor());
        }
        if (properties.getPlugin().getBlockAttack()) {
            // 攻击 SQL 阻断解析器,防止全表更新与删除
            interceptor.addInnerInterceptor(new BlockAttackInnerInterceptor());
        }
        return interceptor;
    }

    /**
     * MyBatis 配置
     */
    @Bean
    public ConfigurationCustomizer configurationCustomizer() {
        return configuration -> {
            configuration.setObjectWrapperFactory(new MybatisMapWrapperFactory());
            configuration.setCacheEnabled(false);
        };
    }

    /**
     * Mybatis Plus 配置
     */
    @Bean
    public MybatisPlusPropertiesCustomizer mybatisPlusPropertiesCustomizer() {
        return properties -> {
            properties.getGlobalConfig().setBanner(false);
            properties.setCheckConfigLocation(true);
            properties.getGlobalConfig().getDbConfig().setUpdateStrategy(FieldStrategy.NOT_EMPTY);
        };
    }

    @Bean
    public ExpandSqlInjector expandSqlInjector() {
        return new ExpandSqlInjector();
    }
}
