package com.vikadata.api.modular.automation.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.entity.AutomationActionEntity;
import org.apache.ibatis.annotations.Param;


/**
 * <p>
 * Automation 机器人 Mapper 接口
 * </p>
 */
public interface AutomationActionMapper extends BaseMapper<AutomationActionEntity> {

    /**
     * 更新 action 输入（json）
     *
     * @param actionId
     * @param input
     * @return
     */
    void updateInput(@Param("actionId") String actionId, @Param("input") String input);

}
