package com.vikadata.api;

import java.util.List;

import com.baomidou.mybatisplus.test.autoconfigure.MybatisPlusTest;
import org.junit.jupiter.api.BeforeAll;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.api.shared.config.MybatisPlusConfig;
import com.vikadata.api.shared.config.properties.MybatisPlusExpandProperties;
import com.vikadata.api.sql.script.enhance.NewSqlScriptsTestExecutionListener;

import org.springframework.beans.BeansException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.beans.factory.config.BeanPostProcessor;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.context.ApplicationContext;
import org.springframework.context.ApplicationContextAware;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.event.ApplicationEventsTestExecutionListener;
import org.springframework.test.context.event.EventPublishingTestExecutionListener;
import org.springframework.test.context.jdbc.SqlScriptsTestExecutionListener;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextBeforeModesTestExecutionListener;
import org.springframework.test.context.support.DirtiesContextTestExecutionListener;
import org.springframework.test.context.transaction.TransactionalTestExecutionListener;
import org.springframework.test.context.web.ServletTestExecutionListener;

/**
 * Quickly test Mapper and use Mybatis-Plus's illegal sql plug-in to achieve reasonable sql
 */
@MybatisPlusTest
@ContextConfiguration(classes = { MybatisPlusExpandProperties.class, MybatisPlusConfig.class })
@AutoConfigureTestDatabase(replace = Replace.NONE)
@TestPropertySource(value = {
        "classpath:test.properties",
}, properties = { "vikadata.mybatis-plus.plugin.illegal-sql=true",
        "vikadata.mybatis-plus.plugin.block-attack=true" })
@TestExecutionListeners(value = { ServletTestExecutionListener.class,
        DirtiesContextBeforeModesTestExecutionListener.class,
        ApplicationEventsTestExecutionListener.class,
        DependencyInjectionTestExecutionListener.class,
        DirtiesContextTestExecutionListener.class,
        TransactionalTestExecutionListener.class,
        NewSqlScriptsTestExecutionListener.class,
        EventPublishingTestExecutionListener.class })
public abstract class AbstractMyBatisMapperTest {

    private static final Logger logger = LoggerFactory.getLogger(AbstractMyBatisMapperTest.class);

    @BeforeAll
    static void setUp(@Autowired JdbcTemplate jdbcTemplate,
            @Value("#{'${exclude}'.split(',')}") List<String> excludeTables,
            @Autowired MybatisPlusExpandProperties properties,
            @Value("${mybatis-plus.configuration-properties.tablePrefix}" )String tablePrefix) {
        logger.info("Whether to enable garbage SQL interception: {}", properties.getPlugin().getIllegalSql());
        logger.info("Whether to attack the SQL blocking parser: {}", properties.getPlugin().getBlockAttack());
        UnitTestUtil.clearDB(jdbcTemplate, excludeTables, tablePrefix);
    }
}
