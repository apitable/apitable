package com.vikadata.api;

import java.util.List;

import com.baomidou.mybatisplus.test.autoconfigure.MybatisPlusTest;
import org.junit.jupiter.api.BeforeAll;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.api.config.MybatisPlusConfig;
import com.vikadata.api.config.properties.MybatisPlusExpandProperties;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;

/**
 * 快速测试Mapper，利用Mybatis-Plus的illegal sql插件实现sql合理
 * @author Shawn Deng
 * @date 2022-03-24 21:37:46
 */
@MybatisPlusTest
@ContextConfiguration(classes = { MybatisPlusExpandProperties.class, MybatisPlusConfig.class })
@AutoConfigureTestDatabase(replace = Replace.NONE)
@TestPropertySource(value = {
        "classpath:test.properties",
}, properties = { "vikadata.mybatis-plus.plugin.illegal-sql=true",
        "vikadata.mybatis-plus.plugin.block-attack=true" })
public abstract class AbstractMyBatisMapperTest {

    private static final Logger logger = LoggerFactory.getLogger(AbstractMyBatisMapperTest.class);

    @BeforeAll
    static void setUp(@Autowired JdbcTemplate jdbcTemplate,
            @Value("#{'${exclude}'.split(',')}") List<String> excludeTables,
            @Autowired MybatisPlusExpandProperties properties) {
        logger.info("是否开启垃圾SQL拦截： {}", properties.getPlugin().getIllegalSql());
        logger.info("是否攻击SQL阻断解析器： {}", properties.getPlugin().getBlockAttack());
        UnitTestUtil.clearDB(jdbcTemplate, excludeTables);
    }
}
