package com.vikadata.api.shared.config;

import java.util.List;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.annotation.FieldStrategy;
import com.baomidou.mybatisplus.autoconfigure.ConfigurationCustomizer;
import com.baomidou.mybatisplus.autoconfigure.MybatisPlusPropertiesCustomizer;
import com.baomidou.mybatisplus.core.injector.AbstractMethod;
import com.baomidou.mybatisplus.core.injector.DefaultSqlInjector;
import com.baomidou.mybatisplus.core.metadata.TableInfo;
import com.baomidou.mybatisplus.extension.MybatisMapWrapperFactory;
import com.baomidou.mybatisplus.extension.injector.methods.InsertBatchSomeColumn;
import com.baomidou.mybatisplus.extension.plugins.MybatisPlusInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.BlockAttackInnerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.IllegalSQLInnerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.OptimisticLockerInnerInterceptor;
import com.baomidou.mybatisplus.extension.plugins.inner.PaginationInnerInterceptor;
import lombok.extern.slf4j.Slf4j;
import org.mybatis.spring.annotation.MapperScan;

import com.vikadata.api.shared.config.properties.MybatisPlusExpandProperties;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * <p>
 * Mybatis-plus Config
 * </p>
 *
 * @author Shawn Deng
 */
@Configuration(proxyBeanMethods = false)
@EnableTransactionManagement
@MapperScan(basePackages = { "com.vikadata.api.enterprise.*.mapper", "com.vikadata.api.*.mapper" })
@Slf4j
public class MybatisPlusConfig {

    private final MybatisPlusExpandProperties properties;

    public MybatisPlusConfig(MybatisPlusExpandProperties properties) {
        this.properties = properties;
    }

    @Bean
    public MybatisPlusInterceptor mybatisPlusInterceptor() {
        MybatisPlusInterceptor interceptor = new MybatisPlusInterceptor();
        interceptor.addInnerInterceptor(new PaginationInnerInterceptor());
        interceptor.addInnerInterceptor(new OptimisticLockerInnerInterceptor());
        if (properties.getPlugin().getIllegalSql()) {
            interceptor.addInnerInterceptor(new IllegalSQLInnerInterceptor());
        }
        if (properties.getPlugin().getBlockAttack()) {
            interceptor.addInnerInterceptor(new BlockAttackInnerInterceptor());
        }
        return interceptor;
    }

    @Bean
    public ConfigurationCustomizer configurationCustomizer() {
        return configuration -> {
            configuration.setObjectWrapperFactory(new MybatisMapWrapperFactory());
            configuration.setCacheEnabled(false);
        };
    }

    @Bean
    public MybatisPlusPropertiesCustomizer mybatisPlusPropertiesCustomizer() {
        return properties -> {
            properties.getGlobalConfig().setBanner(false);
            properties.setCheckConfigLocation(true);
            properties.getGlobalConfig().getDbConfig().setUpdateStrategy(FieldStrategy.NOT_EMPTY);
            properties.setMapperLocations(new String[] { "classpath*:/mapper/**/*.xml", "classpath*:/enterprise/mapper/**/*.xml" });
        };
    }

    @Bean
    public DefaultSqlInjector expandSqlInjector() {
        // Support batch insertion
        return new DefaultSqlInjector() {
            @Override
            public List<AbstractMethod> getMethodList(Class<?> mapperClass, TableInfo tableInfo) {
                List<AbstractMethod> methodList = super.getMethodList(mapperClass, tableInfo);
                InsertBatchSomeColumn insertBatchSomeColumn = new InsertBatchSomeColumn(t -> !StrUtil.equalsAny(t.getProperty(), "createdAt", "updatedAt", "isDeleted"));
                methodList.add(insertBatchSomeColumn);
                return methodList;
            }
        };
    }
}
