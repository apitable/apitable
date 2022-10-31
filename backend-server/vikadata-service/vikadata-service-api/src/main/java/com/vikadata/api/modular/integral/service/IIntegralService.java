package com.vikadata.api.modular.integral.service;

import java.math.BigDecimal;
import java.util.Collection;

import cn.hutool.json.JSONObject;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.vikadata.api.model.vo.integral.IntegralRecordVO;
import com.vikadata.api.modular.integral.enums.IntegralAlterType;

public interface IIntegralService {

    /**
     * get integral by action code
     *
     * @param actionCode integral action identifier
     * @return integral
     */
    BigDecimal getCreditByActionCode(String actionCode);

    /**
     * get the total user integral
     *
     * @param userId    user id
     * @return integral
     */
    int getTotalIntegralValueByUserId(Long userId);

    /**
     * get integral's change records.
     *
     * @param page      page
     * @param userId    user id
     * @return IntegralRecordVO
     */
    IPage<IntegralRecordVO> getIntegralRecordPageByUserId(Page<IntegralRecordVO> page, Long userId);

    /**
     * trigger integral operation
     *
     * @param action    integral action identifier
     * @param alterType alterType
     * @param by        operator
     * @param parameter parameter
     */
    void trigger(String action, IntegralAlterType alterType, Long by, JSONObject parameter);

    /**
     * change integral
     *
     * @param actionCode    integral action identifier
     * @param alterType     alterType
     * @param alterIntegral alterIntegral
     * @param by            operator
     * @param parameter     parameter
     */
    void alterIntegral(String actionCode, IntegralAlterType alterType, int alterIntegral, Long by, JSONObject parameter);

    /**
     * create integral
     *
     * @param userId             userId
     * @param actionCode         integral action identifier
     * @param alterType          alterType
     * @param oldIntegralValue   oldIntegralValue
     * @param alterIntegralValue alterIntegralValue
     * @param parameter          parameter
     * @return record id
     */
    Long createHistory(Long userId, String actionCode, IntegralAlterType alterType, Integer oldIntegralValue, Integer alterIntegralValue, JSONObject parameter);

    /**
     * modify parameter
     *
     * @param recordId      id of the integral history table
     * @param parameter     parameter
     * @author Chambers
     * @date 2021/6/16
     */
    void updateParameterById(Long recordId, String parameter);

    /**
     * get the number of participating activities（the number of add integral）
     *
     * @param userId        userId
     * @param actionCode    integral action identifier
     * @return int
     */
    int getCountByUserIdAndActionCode(Long userId, String actionCode);

    /**
     * Whether user have participated in specified activities
     *
     * @param userId        userId
     * @param actionCodes   integral action identifier
     * @return true | false
     */
    boolean checkByUserIdAndActionCodes(Long userId, Collection<String> actionCodes);

    /**
     * activity integral bonus
     *
     * @param processor the operator
     */
    void activityReward(String processor);
}
