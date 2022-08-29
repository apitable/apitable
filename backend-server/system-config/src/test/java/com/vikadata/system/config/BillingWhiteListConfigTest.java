package com.vikadata.system.config;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class BillingWhiteListConfigTest {

    @Test
    public void testGetConfig() {
        BillingWhiteListConfig config = BillingWhiteListConfigManager.getConfig();
        Assertions.assertNotNull(config);
    }
}
