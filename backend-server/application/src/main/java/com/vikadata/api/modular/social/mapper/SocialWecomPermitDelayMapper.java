package com.vikadata.api.modular.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialWecomPermitDelayEntity;

/**
 * <p>
 * WeCom service provider interface permission delay task processing information
 * </p>
 */
@Mapper
public interface SocialWecomPermitDelayMapper extends BaseMapper<SocialWecomPermitDelayEntity> {

    /**
     * Obtain the delayed processing information of the enterprise
     *
     * @param suiteId App Suite ID
     * @param authCorpId Authorized enterprise ID
     * @param delayType Delay processing type
     * @param processStatuses Processing status
     * @return Delay processing information
     */
    List<SocialWecomPermitDelayEntity> selectByProcessStatuses(@Param("suiteId") String suiteId, @Param("authCorpId") String authCorpId,
            @Param("delayType") Integer delayType, @Param("processStatuses") List<Integer> processStatuses);

    /**
     * Obtain the delayed processing information of the enterprise
     *
     * @param suiteId App Suite ID
     * @param processStatus Processing status
     * @param limit Data Offset
     * @param skip Quantity returned
     * @return Delay processing information
     */
    List<SocialWecomPermitDelayEntity> selectBySuiteIdAndProcessStatus(@Param("suiteId") String suiteId, @Param("processStatus") Integer processStatus,
            @Param("skip") Integer skip, @Param("limit") Integer limit);

}
