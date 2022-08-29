package com.vikadata.api.modular.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.modular.social.model.SpaceBindDomainDTO;
import com.vikadata.entity.SocialTenantDomainEntity;

/**
 * <p>
 * 第三方平台集成-企业租户专属域名 Mapper
 * </p>
 * @author Pengap
 * @date 2021/8/5 20:27:18
 */
public interface SocialTenantDomainMapper extends BaseMapper<SocialTenantDomainEntity> {

    /**
     * 根据空间站查询域名信息
     *
     * @param spaceId   空间站Id
     * @return 域名信息
     * @author Pengap
     * @date 2021/8/13 11:08:54
     */
    SocialTenantDomainEntity selectBySpaceId(@Param("spaceId") String spaceId);

    /**
     * 批量查询空间站域名信息
     *
     * @param spaceIds 空间ID集合
     * @return 域名信息
     * @author Pengap
     * @date 2021/8/13 11:08:54
     */
    List<SocialTenantDomainEntity> selectBySpaceIds(@Param("spaceIds") List<String> spaceIds);

    /**
     * 统计企业微信专属域名前缀重复数量
     *
     * @param domainPrefix 前缀域名（全小写spaceId）
     * @return int 域名数量
     * @author Pengap
     * @date 2021/8/13 11:08:54
     */
    int countTenantDomainName(String domainPrefix);

    /**
     * 查询空间站Id
     *
     * @param domainName 企业域名
     * @return 空间站Id
     * @author Pengap
     * @date 2021/8/24 17:43:52
     */
    String selectSpaceIdByDomainName(@Param("domainName") String domainName);

    /**
     * 查询空间站域名
     *
     * @param spaceIds 空间ids
     * @return 域名集合
     * @author Pengap
     * @date 2021/8/26 14:42:01
     */
    List<SpaceBindDomainDTO> selectSpaceDomainBySpaceIds(@Param("spaceIds") List<String> spaceIds);

    /**
     * 修改域名状态
     *
     * @param spaceId 空间站Id
     * @param domainStatus 状态
     * @return int
     * @author Pengap
     * @date 2021/8/30 12:00:48
     */
    int updateStatusBySpaceId(@Param("spaceId") String spaceId, @Param("domainStatus") int domainStatus);

    /**
     * 获取域名绑定空间状态
     *
     * @param domainName 域名
     * @return 域名绑定信息
     * @author Pengap
     * @date 2021/9/8 16:42:05
     */
    SpaceBindDomainDTO selectSpaceDomainByDomainName(@Param("domainName") String domainName);

    /**
     * 根据空间站Id删除空间站域名
     *
     * @param spaceIds 空间ID集合
     * @return int  影响行数
     * @author Pengap
     * @date 2021/9/13 11:30:40
     */
    int deleteSpaceDomainBySpaceIds(@Param("spaceIds") List<String> spaceIds);

}
