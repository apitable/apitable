package com.vikadata.clock;

import java.time.Instant;
import java.time.OffsetDateTime;
import java.time.ZoneOffset;

import org.redisson.api.RAtomicLong;
import org.redisson.api.RedissonClient;


public class DistributedMockClock extends MockClock {

    private RedissonClient redissonClient;

    // Work around reset being called in parent default constructor
    public void setRedissonClient(final RedissonClient redissonClient) {
        this.redissonClient = redissonClient;
        reset();
    }

    @Override
    protected void setReferenceDateTimeUTC(final OffsetDateTime mockDateTimeUTC) {
        if (redissonClient == null) {
            super.setReferenceDateTimeUTC(mockDateTimeUTC);
            return;
        }
        final RAtomicLong referenceInstantUTC = getReferenceInstantUTC();
        referenceInstantUTC.set(mockDateTimeUTC.toInstant().toEpochMilli());
    }

    @Override
    protected OffsetDateTime getReferenceDateTimeUTC() {
        if (redissonClient == null) {
            return super.getReferenceDateTimeUTC();
        }
        final RAtomicLong referenceInstantUTC = getReferenceInstantUTC();
        return Instant.ofEpochMilli(referenceInstantUTC.get()).atOffset(ZoneOffset.UTC);
    }

    private RAtomicLong getReferenceInstantUTC() {
        return redissonClient.getAtomicLong("ReferenceInstantUTC");
    }
}
