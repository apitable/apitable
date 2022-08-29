package com.vikadata.api.modular.integral.service;

import java.math.BigDecimal;
import java.util.Collection;

import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.vikadata.api.model.vo.integral.IntegralRecordVO;
import com.vikadata.api.modular.integral.enums.IntegralAlterType;

/**
 * <p>
 * 积分 服务接口
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/16 11:23
 */
public interface IIntegralService {

    /**
     * 根据积分触发动作获取积分值
     *
     * @param actionCode 积分动作标识
     * @return 积分值
     * @author Shawn Deng
     * @date 2020/12/31 19:36
     */
    BigDecimal getCreditByActionCode(String actionCode);

    /**
     * 获取用户总积分值
     *
     * @param userId 用户ID
     * @return 积分值
     * @author Shawn Deng
     * @date 2020/12/31 20:19
     */
    int getTotalIntegralValueByUserId(Long userId);

    /**
     * 获取积分变更记录
     *
     * @param page      分页参数
     * @param userId    用户ID
     * @return IntegralRecordVO
     * @author Chambers
     * @date 2021/6/16
     */
    IPage<IntegralRecordVO> getIntegralRecordPageByUserId(Page<IntegralRecordVO> page, Long userId);

    /**
     * 触发积分操作
     *
     * @param action    积分动作标识
     * @param alterType 变更类型
     * @param by        操作者
     * @param parameter 参数体
     * @author Shawn Deng
     * @date 2020/9/17 13:15
     */
    void trigger(String action, IntegralAlterType alterType, Long by, JSONObject parameter);

    /**
     * 变更积分
     *
     * @param actionCode    积分动作标识
     * @param alterType     变更类型
     * @param alterIntegral 变更积分值
     * @param by            操作用户
     * @param parameter     参数体
     * @author Shawn Deng
     * @date 2020/9/17 13:15
     */
    void alterIntegral(String actionCode, IntegralAlterType alterType, int alterIntegral, Long by, JSONObject parameter);

    /**
     * 创建积分记录
     *
     * @param userId             操作用户
     * @param actionCode         积分动作标识
     * @param alterType          变更类型
     * @param oldIntegralValue   用户变更前积分值
     * @param alterIntegralValue 本次变更的值
     * @param parameter          参数体
     * @return 记录ID
     * @author Shawn Deng
     * @date 2020/9/17 13:16
     */
    Long createHistory(Long userId, String actionCode, IntegralAlterType alterType, Integer oldIntegralValue, Integer alterIntegralValue, JSONObject parameter);

    /**
     * 修改参数体
     *
     * @param recordId      积分历史表ID
     * @param parameter     参数体
     * @author Chambers
     * @date 2021/6/16
     */
    void updateParameterById(Long recordId, String parameter);

    /**
     * 获取参与活动次数（添加积分记录次数）
     *
     * @param userId        操作用户
     * @param actionCode    积分动作标识
     * @return int
     * @author Pengap
     * @date 2021/10/21 10:29:03
     */
    int getCountByUserIdAndActionCode(Long userId, String actionCode);

    /**
     * 是否参与过指定活动
     * @param userId 操作用户
     * @param actionCodes 积分动作标识
     * @return true | false
     */
    boolean checkByUserIdAndActionCodes(Long userId, Collection<String> actionCodes);

    /**
     * 活动积分奖励
     *
     * @param processor 操作者
     * @author Chambers
     * @date 2022/6/24
     */
    void activityReward(String processor);
}
