package com.vikadata.api.modular.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialWecomPermitDelayEntity;

/**
 * <p>
 * 企微服务商接口许可延时任务处理信息
 * </p>
 * @author 刘斌华
 * @date 2022-07-19 09:49:13
 */
@Mapper
public interface SocialWecomPermitDelayMapper extends BaseMapper<SocialWecomPermitDelayEntity> {

    /**
     * 获取企业的延时处理信息
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param delayType 延时处理类型
     * @param processStatuses 处理状态
     * @return 延时处理信息
     * @author 刘斌华
     * @date 2022-07-19 11:11:27
     */
    List<SocialWecomPermitDelayEntity> selectByProcessStatuses(@Param("suiteId") String suiteId, @Param("authCorpId") String authCorpId,
            @Param("delayType") Integer delayType, @Param("processStatuses") List<Integer> processStatuses);

    /**
     * 获取企业的延时处理信息
     *
     * @param suiteId 应用套件 ID
     * @param processStatus 处理状态
     * @param limit 数据偏移
     * @param skip 返回的数量
     * @return 延时处理信息
     * @author 刘斌华
     * @date 2022-07-19 11:11:27
     */
    List<SocialWecomPermitDelayEntity> selectBySuiteIdAndProcessStatus(@Param("suiteId") String suiteId, @Param("processStatus") Integer processStatus,
            @Param("skip") Integer skip, @Param("limit") Integer limit);

}
