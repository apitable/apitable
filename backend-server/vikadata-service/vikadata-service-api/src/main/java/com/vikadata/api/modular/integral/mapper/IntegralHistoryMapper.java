package com.vikadata.api.modular.integral.mapper;

import java.util.Collection;

import com.baomidou.mybatisplus.annotation.InterceptorIgnore;
import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.model.vo.integral.IntegralRecordVO;
import com.vikadata.entity.IntegralHistoryEntity;

public interface IntegralHistoryMapper extends BaseMapper<IntegralHistoryEntity> {

    /**
     * query user's maximum integral value
     *
     * @param userId    user id
     * @return integral value
     */
    Integer selectTotalIntegralValueByUserId(@Param("userId") Long userId);

    /**
     * page query user's integral change record.
     *
     * @param page   page object
     * @param userId user id
     * @return change records
     */
    IPage<IntegralRecordVO> selectPageByUserId(Page<IntegralRecordVO> page, @Param("userId") Long userId);

    /**
     * query the user's the amount of key and value.
     *
     * @param userId userId
     * @param key    key
     * @param val    val
     * @return count
     */
    @InterceptorIgnore(illegalSql = "true")
    Integer selectCountByUserIdAndKeyValue(@Param("userId") Long userId, @Param("key") String key, @Param("val") Object val);

    /**
     * modify parameter body
     *
     * @param id        id
     * @param parameter parameter
     * @return affected row
     */
    int updateParameterById(@Param("id") Long id, @Param("parameter") String parameter);

    /**
     * query the number of activities the user participated in
     *
     * @param userId        user id
     * @param actionCode    integral action identifier
     * @return the amount of participated in
     */
    Integer selectCountByUserIdAndActionCode(@Param("userId") Long userId, @Param("actionCode") String actionCode);

    /**
     * query the number of activities the user participated in
     *
     * @param userId        user id
     * @param actionCodes   integral action identifier set
     * @return the amount of participated in
     */
    Integer selectCountByUserIdAndActionCodes(@Param("userId") Long userId, @Param("actionCodes") Collection<String> actionCodes);
}
