package com.vikadata.clock;

import org.junit.jupiter.api.Test;

public class TestClockMock extends TestClockMockBase {

    @Test
    public void testBasicClockOperations() {
        final MockClock clock = new MockClock();
        testBasicClockOperations(clock);
    }
}
