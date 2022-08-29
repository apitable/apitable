package com.vikadata.api.modular.automation.service.impl;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.vikadata.api.modular.automation.mapper.AutomationRobotMapper;
import com.vikadata.api.modular.automation.model.*;
import com.vikadata.api.modular.automation.service.IAutomationActionService;
import com.vikadata.api.modular.automation.service.IAutomationRobotService;
import com.vikadata.api.modular.automation.service.IAutomationTriggerService;
import com.vikadata.api.modular.automation.service.IAutomationTriggerTypeService;
import com.vikadata.api.util.IdUtil;
import com.vikadata.core.support.ResponseData;
import com.vikadata.entity.AutomationRobotEntity;
import com.vikadata.entity.AutomationTriggerEntity;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.List;

@Service
@Slf4j
public class AutomationRobotServiceImpl extends ServiceImpl<AutomationRobotMapper, AutomationRobotEntity> implements IAutomationRobotService {

    private final Logger logger = LoggerFactory.getLogger(AutomationRobotServiceImpl.class);

    @Resource
    private IAutomationRobotService  iAutomationRobotService;

    @Resource
    private IAutomationTriggerService iAutomationTriggerService;

    @Resource
    private IAutomationTriggerTypeService iAutomationTriggerTypeService;

    @Resource
    private IAutomationActionService iAutomationActionService;

    @Override
    public List<AutomationRobotDto> getRobotListByResourceId(String resourceId) {
        List<AutomationRobotDto> robots = baseMapper.getRobotsByResourceId(resourceId);
        return robots;
    }

    @Override
    public void delete(List<String> robotIds) {
        baseMapper.deleteByRobotId(robotIds);
    }

    @Override
    public void updateByRobotId(AutomationRobotEntity robot) {
        baseMapper.updateRobotById(robot.getRobotId(),robot.getName(),robot.getDescription(),robot.getResourceId());
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public ResponseData<AutomationTriggerCreateVo> upsert(AutomationApiTriggerCreateRo data,String xServiceToken) {
        AutomationTriggerCreateVo automationTriggerCreateVo = new AutomationTriggerCreateVo();

        //1、创建机器人
        String robotId = IdUtil.createAutomationRobotId();
        AutomationRobotEntity robot = AutomationRobotEntity.builder()
            .name(data.getRobot().getName())
            .description(data.getRobot().getDescription())
            .robotId(robotId)
            .resourceId(data.getRobot().getResourceId())
            .seqId(data.getSeqId())
            .xServiceToken(xServiceToken)
            .isActive(1)
            .build();
        String[] typeNameId = StrUtil.split(data.getTrigger().getTypeName(), "@");
        String triggerTypeId = iAutomationTriggerTypeService.getTriggerTypeByEndpoint(typeNameId[0]);
        AutomationTriggerEntity trigger = AutomationTriggerEntity.builder()
            .robotId(robotId)
            .triggerTypeId(triggerTypeId)
            .input(StrUtil.toString(iAutomationTriggerService.transformInput(data.getTrigger().getInput())))
            .build();

        try{
            iAutomationRobotService.save(robot);
        }catch (Exception e){
            //当执行过插入,调整为更新形式
            List<AutomationTriggerDto> automationTriggerDtoList = iAutomationTriggerService.getTriggersBySeqId(data.getSeqId(), data.getRobot().getResourceId());
            if (automationTriggerDtoList.size()>0){
                //更新己存在的机器人
                automationTriggerDtoList.stream().forEach(i->{
                    automationTriggerCreateVo.setTriggerId(i.getTriggerId());
                    automationTriggerCreateVo.setRobotId(i.getRobotId());
                });
                robot.setRobotId(automationTriggerCreateVo.getRobotId());
                iAutomationRobotService.updateByRobotId(robot);
                trigger.setRobotId(automationTriggerCreateVo.getRobotId());
                trigger.setTriggerId(automationTriggerCreateVo.getTriggerId());
                iAutomationTriggerService.updateTriggerById(trigger);
                iAutomationActionService.updateRequestAction(automationTriggerCreateVo.getRobotId(),automationTriggerCreateVo.getTriggerId(),"POST","Content-Type: application/json",data.getWebhookUrl());
                return ResponseData.success(automationTriggerCreateVo);
            }
            logger.info("create robot fail , err:{}",e.getMessage());
            return ResponseData.status(false,602,"请勿重复创建").data(automationTriggerCreateVo);
        }

        //2、创建trigger触发器

        String triggerId = IdUtil.createAutomationTriggerId();
        trigger.setTriggerId(triggerId);
        iAutomationTriggerService.save(trigger);

        //3、创建action执行动作
        iAutomationActionService.createRequestAction(robotId,triggerId,"POST","Content-Type: application/json", data.getWebhookUrl());
        automationTriggerCreateVo.setRobotId(robotId);
        automationTriggerCreateVo.setTriggerId(triggerId);
        return ResponseData.success(automationTriggerCreateVo);
    }

}
