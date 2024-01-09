package com.apitable.automation.service;


import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;

import cn.hutool.core.lang.Dict;
import cn.hutool.json.JSONUtil;
import com.apitable.AbstractIntegrationTest;
import com.apitable.automation.entity.AutomationRobotEntity;
import com.apitable.automation.entity.AutomationTriggerEntity;
import com.apitable.automation.entity.AutomationTriggerTypeEntity;
import com.apitable.automation.enums.AutomationTriggerType;
import com.apitable.automation.model.CreateTriggerRO;
import com.apitable.automation.model.TriggerRO;
import com.apitable.automation.model.TriggerVO;
import com.apitable.automation.model.UpdateTriggerRO;
import com.apitable.core.exception.BusinessException;
import com.apitable.mock.bean.MockUserSpace;
import com.apitable.shared.util.IdUtil;
import com.apitable.workspace.enums.NodeType;
import com.baomidou.mybatisplus.core.toolkit.IdWorker;
import java.math.BigInteger;
import java.util.List;
import org.junit.jupiter.api.Test;

public class AutomationTriggerServiceImplTest extends AbstractIntegrationTest {


    @Test
    public void testCreateTrigger() {
        MockUserSpace user = createSingleUserAndSpace();
        CreateTriggerRO ro = new CreateTriggerRO();
        ro.setRobotId("test_robot_id");
        BusinessException exception =
            assertThrows(BusinessException.class,
                () -> iAutomationTriggerService.create(user.getUserId(), user.getSpaceId(), ro));
        assertEquals(1104, exception.getCode());
    }

    @Test
    public void testCreateTriggerWithTriggerOutOfLimit() {
        MockUserSpace user = createSingleUserAndSpace();
        AutomationRobotEntity robot = AutomationRobotEntity.builder()
            .id(BigInteger.valueOf(IdWorker.getId()))
            .robotId(IdUtil.createAutomationRobotId())
            .resourceId(IdUtil.createNodeId(NodeType.AUTOMATION))
            .build();
        iAutomationRobotService.create(robot);
        for (int i = 0; i < 3; i++) {
            iAutomationTriggerService.create(
                AutomationTriggerEntity.builder().robotId(robot.getRobotId())
                    .triggerId(IdUtil.createAutomationTriggerId()).triggerTypeId("test_type_id")
                    .build());
        }
        CreateTriggerRO ro = new CreateTriggerRO();
        ro.setRobotId(robot.getRobotId());
        BusinessException exception =
            assertThrows(BusinessException.class,
                () -> iAutomationTriggerService.create(user.getUserId(), user.getSpaceId(), ro));
        assertEquals(1105, exception.getCode());
    }

    @Test
    public void testCreateTriggerNotSchedule() {
        MockUserSpace user = createSingleUserAndSpace();
        AutomationRobotEntity robot = AutomationRobotEntity.builder()
            .id(BigInteger.valueOf(IdWorker.getId()))
            .robotId(IdUtil.createAutomationRobotId())
            .resourceId(IdUtil.createNodeId(NodeType.AUTOMATION))
            .build();
        AutomationTriggerTypeEntity triggerTypeEntity = AutomationTriggerTypeEntity.builder()
            .id(IdWorker.getId())
            .endpoint(AutomationTriggerType.BUTTON_CLICKED.getType())
            .triggerTypeId(IdUtil.createAutomationTriggerTypeId())
            .serviceId("test_service_id")
            .build();
        iAutomationTriggerTypeService.save(triggerTypeEntity);
        iAutomationRobotService.create(robot);

        CreateTriggerRO ro = new CreateTriggerRO();
        ro.setRobotId(robot.getRobotId());
        ro.setTriggerTypeId(triggerTypeEntity.getTriggerTypeId());
        ro.setInput(new Dict());
        ro.setScheduleConfig(new TriggerRO.TriggerScheduleConfig());
        List<TriggerVO> trigger =
            iAutomationTriggerService.create(user.getUserId(), user.getSpaceId(), ro);
        verify(rabbitSenderService, times(0)).topicSend("exchange", "topic", JSONUtil.createObj());
        assertThat(trigger.get(0).getInput()).isEqualTo(JSONUtil.toJsonStr(new Dict()));
    }

    @Test
    public void testCreateTriggerWithEmptySchedule() {
        MockUserSpace user = createSingleUserAndSpace();
        AutomationRobotEntity robot = AutomationRobotEntity.builder()
            .id(BigInteger.valueOf(IdWorker.getId()))
            .robotId(IdUtil.createAutomationRobotId())
            .resourceId(IdUtil.createNodeId(NodeType.AUTOMATION))
            .build();
        AutomationTriggerTypeEntity triggerTypeEntity = AutomationTriggerTypeEntity.builder()
            .id(IdWorker.getId())
            .endpoint(AutomationTriggerType.SCHEDULED_TIME_ARRIVE.getType())
            .triggerTypeId(IdUtil.createAutomationTriggerTypeId())
            .serviceId("test_service_id")
            .build();
        iAutomationTriggerTypeService.save(triggerTypeEntity);
        iAutomationRobotService.create(robot);

        CreateTriggerRO ro = new CreateTriggerRO();
        ro.setRobotId(robot.getRobotId());
        ro.setTriggerTypeId(triggerTypeEntity.getTriggerTypeId());
        ro.setInput(new Dict());
        ro.setScheduleConfig(new TriggerRO.TriggerScheduleConfig());
        List<TriggerVO> trigger =
            iAutomationTriggerService.create(user.getUserId(), user.getSpaceId(), ro);
        verify(rabbitSenderService, times(0)).topicSend("exchange", "topic", JSONUtil.createObj());
        assertThat(trigger.get(0).getInput()).isEqualTo(JSONUtil.toJsonStr(new Dict()));
    }

    @Test
    public void testCreateTriggerWithNotEmptySchedule() {
        MockUserSpace user = createSingleUserAndSpace();
        AutomationRobotEntity robot = AutomationRobotEntity.builder()
            .id(BigInteger.valueOf(IdWorker.getId()))
            .robotId(IdUtil.createAutomationRobotId())
            .resourceId(IdUtil.createNodeId(NodeType.AUTOMATION))
            .build();
        AutomationTriggerTypeEntity triggerTypeEntity = AutomationTriggerTypeEntity.builder()
            .id(IdWorker.getId())
            .endpoint(AutomationTriggerType.SCHEDULED_TIME_ARRIVE.getType())
            .triggerTypeId(IdUtil.createAutomationTriggerTypeId())
            .serviceId("test_service_id")
            .build();
        iAutomationTriggerTypeService.save(triggerTypeEntity);
        iAutomationRobotService.create(robot);

        CreateTriggerRO ro = new CreateTriggerRO();
        ro.setRobotId(robot.getRobotId());
        ro.setTriggerTypeId(triggerTypeEntity.getTriggerTypeId());
        ro.setInput(new Dict());
        TriggerRO.TriggerScheduleConfig scheduleConfig = new TriggerRO.TriggerScheduleConfig();
        scheduleConfig.setHour("1");
        ro.setScheduleConfig(scheduleConfig);
        List<TriggerVO> trigger =
            iAutomationTriggerService.create(user.getUserId(), user.getSpaceId(), ro);
        verify(rabbitSenderService, times(1)).topicSend(anyString(), anyString(), any());
        assertThat(trigger.get(0).getInput()).isEqualTo(JSONUtil.toJsonStr(new Dict()));
    }

    @Test
    public void testUpdateTriggerTypeToSchedule() {
        MockUserSpace user = createSingleUserAndSpace();
        AutomationRobotEntity robot = AutomationRobotEntity.builder()
            .id(BigInteger.valueOf(IdWorker.getId()))
            .robotId(IdUtil.createAutomationRobotId())
            .resourceId(IdUtil.createNodeId(NodeType.AUTOMATION))
            .build();
        AutomationTriggerTypeEntity triggerTypeEntity = AutomationTriggerTypeEntity.builder()
            .id(IdWorker.getId())
            .endpoint(AutomationTriggerType.BUTTON_CLICKED.getType())
            .triggerTypeId(IdUtil.createAutomationTriggerTypeId())
            .serviceId("test_service_id")
            .build();
        AutomationTriggerTypeEntity scheduleTypeEntity = AutomationTriggerTypeEntity.builder()
            .id(IdWorker.getId())
            .endpoint(AutomationTriggerType.SCHEDULED_TIME_ARRIVE.getType())
            .triggerTypeId(IdUtil.createAutomationTriggerTypeId())
            .serviceId("test_service_id")
            .build();
        iAutomationTriggerTypeService.save(triggerTypeEntity);
        iAutomationTriggerTypeService.save(scheduleTypeEntity);
        iAutomationRobotService.create(robot);
        CreateTriggerRO ro = new CreateTriggerRO();
        ro.setRobotId(robot.getRobotId());
        ro.setTriggerTypeId(triggerTypeEntity.getTriggerTypeId());
        List<TriggerVO> triggers =
            iAutomationTriggerService.create(user.getUserId(), user.getSpaceId(), ro);
        String triggerId = triggers.get(0).getTriggerId();
        UpdateTriggerRO updateRo = new UpdateTriggerRO();
        updateRo.setRobotId(robot.getRobotId());
        updateRo.setTriggerTypeId(scheduleTypeEntity.getTriggerTypeId());
        List<TriggerVO> updatedTriggers =
            iAutomationTriggerService.update(user.getUserId(), triggerId, user.getSpaceId(),
                updateRo);
        assertThat(updatedTriggers.get(0).getTriggerTypeId()).isEqualTo(
            scheduleTypeEntity.getTriggerTypeId());
        verify(rabbitSenderService, times(0)).topicSend(anyString(), anyString(), any());
    }


    @Test
    public void testUpdateTriggerScheduleConfig() {
        MockUserSpace user = createSingleUserAndSpace();
        AutomationRobotEntity robot = AutomationRobotEntity.builder()
            .id(BigInteger.valueOf(IdWorker.getId()))
            .robotId(IdUtil.createAutomationRobotId())
            .resourceId(IdUtil.createNodeId(NodeType.AUTOMATION))
            .build();
        AutomationTriggerTypeEntity triggerTypeEntity = AutomationTriggerTypeEntity.builder()
            .id(IdWorker.getId())
            .endpoint(AutomationTriggerType.SCHEDULED_TIME_ARRIVE.getType())
            .triggerTypeId(IdUtil.createAutomationTriggerTypeId())
            .serviceId("test_service_id")
            .build();
        iAutomationTriggerTypeService.save(triggerTypeEntity);
        iAutomationRobotService.create(robot);
        CreateTriggerRO ro = new CreateTriggerRO();
        ro.setRobotId(robot.getRobotId());
        ro.setTriggerTypeId(triggerTypeEntity.getTriggerTypeId());
        List<TriggerVO> triggers =
            iAutomationTriggerService.create(user.getUserId(), user.getSpaceId(), ro);
        String triggerId = triggers.get(0).getTriggerId();
        UpdateTriggerRO updateRo = new UpdateTriggerRO();
        updateRo.setRobotId(robot.getRobotId());
        TriggerRO.TriggerScheduleConfig scheduleConfig = new TriggerRO.TriggerScheduleConfig();
        scheduleConfig.setHour("1");
        updateRo.setScheduleConfig(scheduleConfig);
        List<TriggerVO> updatedTriggers =
            iAutomationTriggerService.update(user.getUserId(), triggerId, user.getSpaceId(),
                updateRo);
        assertThat(updatedTriggers.get(0).getTriggerTypeId()).isEqualTo(
            triggerTypeEntity.getTriggerTypeId());
        verify(rabbitSenderService, times(1)).topicSend(anyString(), anyString(), any());
    }
}
