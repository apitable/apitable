package com.vikadata.api;

import java.time.Duration;
import java.time.Instant;
import java.util.stream.Stream;

import com.baomidou.mybatisplus.test.autoconfigure.MybatisPlusTest;
import lombok.extern.slf4j.Slf4j;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.MySQLContainer;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.testcontainers.lifecycle.Startables;
import org.testcontainers.utility.DockerImageName;

import com.vikadata.api.config.MybatisPlusConfig;

import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase.Replace;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

/**
 * 抽象容器集成类：Mysql、redis
 * @author Shawn Deng
 * @date 2022-03-20 00:12:54
 */
@Testcontainers
@MybatisPlusTest
@ContextConfiguration(classes = MybatisPlusConfig.class)
@AutoConfigureTestDatabase(replace = Replace.NONE)
@ActiveProfiles({ "test" })
// @TestPropertySource(value = {
//         "classpath:application.properties",
//         "classpath:application-test.properties"
// })
@DirtiesContext
@Slf4j
public abstract class IntegrationTest {

    private static final DockerImageName MYSQL_IMAGE = DockerImageName.parse("mysql:8.0.23");

    private static final DockerImageName REDIS_IMAGE = DockerImageName.parse("redis:6.0.2");

    static final MySQLContainer<?> testMySQLContainer;

    static final GenericContainer<?> testRedisContainer;

    static {
        Instant start = Instant.now();
        // 单例模式，对于继承此类的测试用例都只启动一次
        testMySQLContainer = new MySQLContainer<>(MYSQL_IMAGE)
                .withCommand("--character-set-server=utf8mb4", "--collation-server=utf8mb4_unicode_ci")
                // .withReuse(true)
                // .withLabel("reuse.UUID", "e06d7a87-7d7d-472e-a047-e6c81f61d2a4")
                .withInitScript("db/migration/__INIT__.sql");
        testRedisContainer = new GenericContainer<>(REDIS_IMAGE)
                // .withReuse(true)
                // .withLabel("reuse.UUID", "0429783b-c855-4b32-8239-258cba232b63")
                .withExposedPorts(6379);
        // 并行启动
        Startables.deepStart(Stream.of(testMySQLContainer, testRedisContainer)).join();
        log.info("🐳 TestContainers started in {}", Duration.between(start, Instant.now()));
    }

    @DynamicPropertySource
    static void datasourceProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", testMySQLContainer::getJdbcUrl);
        registry.add("spring.datasource.username", testMySQLContainer::getUsername);
        registry.add("spring.datasource.password", testMySQLContainer::getPassword);

        registry.add("spring.redis.host", testRedisContainer::getContainerIpAddress);
        registry.add("spring.redis.port", testRedisContainer::getFirstMappedPort);
    }
}
