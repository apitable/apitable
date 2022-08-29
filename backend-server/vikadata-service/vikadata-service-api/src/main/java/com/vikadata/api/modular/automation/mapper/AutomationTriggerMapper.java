package com.vikadata.api.modular.automation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.api.modular.automation.model.AutomationTriggerDto;
import com.vikadata.entity.AutomationTriggerEntity;
import org.apache.ibatis.annotations.Param;

import java.util.List;


/**
 * <p>
 * Automation 机器人 Mapper 接口
 * </p>
 *
 * @author Mayne
 * @date 2021/08/04
 */
public interface AutomationTriggerMapper extends BaseMapper<AutomationTriggerEntity> {

    /**
     * 更新 trigger 输入（json）
     *
     * @param triggerId
     * @param input
     * @return
     */
    void updateInput(@Param("triggerId") String triggerId,@Param("triggerTypeId") String triggerTypeId,@Param("input") String input);

    /**
     * @param resourceId
     * @return
     */
    List<AutomationTriggerDto> getTriggersByResourceId(@Param("resourceId") String resourceId);

    /**
     * @param seqId
     * @param resourceId
     * @return
     */
    List<AutomationTriggerDto> getTriggersBySeqId(@Param("seqId") String seqId,@Param("resourceId") String resourceId);

    /***
     *  删除 trigger
     * @param triggerId
     */
    void deleteTriggerById(@Param("triggerId")String triggerId);

    /***
     *  通过机器人id 删除 trigger
     * @param robotId
     */
    void deleteTriggerByRobotId(@Param("robotId")String robotId);

}
