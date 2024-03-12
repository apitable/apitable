package com.apitable.automation.service.impl;


import static org.assertj.core.api.Assertions.assertThat;

import com.apitable.AbstractIntegrationTest;
import com.apitable.automation.entity.AutomationTriggerEntity;
import com.apitable.automation.model.AutomationTriggerDto;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.shared.util.IdUtil;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import java.math.BigInteger;
import java.util.Collections;
import java.util.List;
import org.junit.jupiter.api.Test;

public class AutomationTriggerServiceImplTest extends AbstractIntegrationTest {
    @Test
    public void testDeleteAutomationTrigger() {
        MockUserSpace userSpace = createSingleUserAndSpace();
        AutomationTriggerEntity trigger = AutomationTriggerEntity.builder()
            .id(BigInteger.valueOf(IdWorker.getId()))
            .robotId(IdUtil.createAutomationRobotId())
            .triggerId(IdUtil.createAutomationTriggerId())
            .triggerTypeId(IdUtil.createAutomationTriggerTypeId())
            .build();
        iAutomationTriggerService.create(trigger);
        iAutomationTriggerService.deleteByTriggerId(trigger.getRobotId(), trigger.getTriggerId(),
            userSpace.getUserId());
        List<AutomationTriggerDto> triggers = iAutomationTriggerService.getTriggersByRobotIds(
            Collections.singletonList(trigger.getRobotId()));
        assertThat(triggers).isEmpty();
    }
}
