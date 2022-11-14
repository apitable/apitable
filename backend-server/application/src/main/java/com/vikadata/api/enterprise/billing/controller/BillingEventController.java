package com.vikadata.api.enterprise.billing.controller;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.component.clock.ClockManager;
import com.vikadata.api.enterprise.billing.model.EventVO;
import com.vikadata.api.enterprise.billing.util.BillingConfigManager;
import com.vikadata.core.support.ResponseData;
import com.vikadata.system.config.billing.Event;

import org.springframework.web.bind.annotation.RestController;

/**
 * Billing Event Api
 */
@RestController
@Api(tags = "Billing Event Api")
@ApiResource(path = "/")
public class BillingEventController {

    @GetResource(path = "/events/active", requiredPermission = false)
    @ApiOperation(value = "fetch event list")
    public ResponseData<EventVO> fetchEventList() {
        Event event = BillingConfigManager.getEventOnEffectiveDate(ClockManager.me().getLocalDateNow());
        return ResponseData.success(EventVO.of(event));
    }
}
