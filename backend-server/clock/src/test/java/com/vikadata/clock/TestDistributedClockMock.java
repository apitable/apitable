package com.vikadata.clock;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.redisson.Redisson;
import org.redisson.api.RedissonClient;
import org.redisson.config.Config;
import redis.embedded.RedisServer;

public class TestDistributedClockMock extends TestClockMockBase {

    private RedisServer redisServer;

    private static final int REDIS_PORT = 16379;

    @BeforeEach
    public void setUp() {
        redisServer = new RedisServer(REDIS_PORT);
        redisServer.start();
    }

    @AfterEach
    public void tearDown() {
        redisServer.stop();
    }

    @Test
    public void testBasicClockOperations() {
        final Config config = new Config();
        config.useSingleServer().setAddress("redis://127.0.0.1:" + REDIS_PORT);
        final RedissonClient redissonClient = Redisson.create(config);
        try {
            final DistributedMockClock clock = new DistributedMockClock();
            clock.setRedissonClient(redissonClient);
            testBasicClockOperations(clock);
        }
        finally {
            redissonClient.shutdown();
        }
    }
}
