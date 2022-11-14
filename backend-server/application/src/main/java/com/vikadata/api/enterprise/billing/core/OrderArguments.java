package com.vikadata.api.enterprise.billing.core;

import com.vikadata.system.config.billing.Price;

public interface OrderArguments {

    String getSpaceId();

    Price getPrice();
}
