package com.vikadata.api.modular.finance.core;

import com.vikadata.system.config.billing.Price;

public interface OrderArguments {

    String getSpaceId();

    Price getPrice();
}
