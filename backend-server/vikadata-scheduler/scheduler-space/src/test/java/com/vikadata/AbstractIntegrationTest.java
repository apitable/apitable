package com.vikadata;

import java.util.List;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.scheduler.space.SchedulerSpaceApplication;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.TestPropertySource;


@SpringBootTest(classes = { SchedulerSpaceApplication.class })
@AutoConfigureMockMvc
@ExtendWith({ MockitoExtension.class })
@TestPropertySource(value = {
        "classpath:test.properties",
})
public abstract class AbstractIntegrationTest {

    private static final Logger logger = LoggerFactory.getLogger(AbstractIntegrationTest.class);

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @Value("#{'${exclude}'.split(',')}")
    private List<String> excludeTables;

    @BeforeEach
    void setup() {
        UnitTestUtil.clearDB(jdbcTemplate, excludeTables);
        UnitTestUtil.cleanCacheKeys(redisTemplate);
    }
}
