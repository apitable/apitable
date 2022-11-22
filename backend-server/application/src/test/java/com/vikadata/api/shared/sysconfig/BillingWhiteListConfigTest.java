package com.vikadata.api.shared.sysconfig;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;

public class BillingWhiteListConfigTest {

    @Test
    public void testGetConfig() {
        BillingWhiteListConfig config = BillingWhiteListConfigManager.getConfig();
        Assertions.assertNotNull(config);
    }
}
