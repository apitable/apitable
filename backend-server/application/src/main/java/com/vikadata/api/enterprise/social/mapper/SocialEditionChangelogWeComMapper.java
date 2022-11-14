package com.vikadata.api.enterprise.social.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialEditionChangelogWecomEntity;

/**
 * <p>
 * Third party platform integration - WeChat third-party service provider application version change information
 * </p>
 */
@Mapper
public interface SocialEditionChangelogWeComMapper extends BaseMapper<SocialEditionChangelogWecomEntity> {

    /**
     * Get the latest WeChat version information
     *
     * @param suiteId App Suite ID
     * @param paidCorpId Authorized enterprise ID paid
     * @return Application version information
     */
    SocialEditionChangelogWecomEntity selectLastChangeLog(@Param("suiteId") String suiteId, @Param("paidCorpId") String paidCorpId);

}
