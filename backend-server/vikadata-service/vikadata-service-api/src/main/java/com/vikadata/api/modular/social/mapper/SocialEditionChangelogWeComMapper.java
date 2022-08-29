package com.vikadata.api.modular.social.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialEditionChangelogWecomEntity;

/**
 * <p>
 * 第三方平台集成 - 企业微信第三方服务商应用版本变更信息
 * </p>
 * @author 刘斌华
 * @date 2022-04-28 10:33:01
 */
@Mapper
public interface SocialEditionChangelogWeComMapper extends BaseMapper<SocialEditionChangelogWecomEntity> {

    /**
     * 获取最近一条的企微版本信息
     *
     * @param suiteId 应用套件 ID
     * @param paidCorpId 支付的授权企业 ID
     * @return 应用版本信息
     * @author 刘斌华
     * @date 2022-05-06 18:57:33
     */
    SocialEditionChangelogWecomEntity selectLastChangeLog(@Param("suiteId") String suiteId, @Param("paidCorpId") String paidCorpId);

}
