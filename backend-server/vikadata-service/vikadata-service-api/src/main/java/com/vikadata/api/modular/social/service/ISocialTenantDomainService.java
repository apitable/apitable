package com.vikadata.api.modular.social.service;

import java.util.List;
import java.util.Map;

import com.baomidou.mybatisplus.extension.service.IService;

import com.vikadata.api.modular.social.model.SpaceBindDomainDTO;
import com.vikadata.entity.SocialTenantDomainEntity;

/**
 * <p>
 * 第三方平台集成-企业租户专属域名 服务接口
 * </p>
 * @author Pengap
 * @date 2021/8/5 20:18:04
 */
public interface ISocialTenantDomainService extends IService<SocialTenantDomainEntity> {

    /**
     * 创建域名（状态：绑定中）
     *
     * @param spaceId       空间站Id
     * @param domainPrefix  域名前缀
     * @param domainName    域名
     * @author Pengap
     * @date 2021/8/30 11:49:58
     */
    SocialTenantDomainEntity createDomain(String spaceId, String domainPrefix, String domainName);

    /**
     * 启用域名
     *
     * @param spaceId   空间站Id
     * @author Pengap
     * @date 2021/8/30 11:50:02
     */
    void enabledDomain(String spaceId);

    /**
     * 删除域名并且删除域名DDNS解析记录
     *
     * @param spaceIds 空间站Id
     * @author Pengap
     * @date 2021/9/13 11:29:24
     */
    void removeDomain(List<String> spaceIds);

    /**
     * 获取空间站域名
     *
     * @param spaceId           空间站Id
     * @param apendHttpsPrefix  是否自动添加https前缀，false 返回没有协议的域名
     * @return 域名（获取不到时，返回公网域名）
     * @author Pengap
     * @date 2021/8/26 11:00:09
     */
    String getDomainNameBySpaceId(String spaceId, boolean apendHttpsPrefix);

    /**
     * 获取空间站域名（不带http协议头的域名）
     *
     * @param spaceId           空间站Id
     * @return 域名（获取不到时，返回公网域名）
     * @author Pengap
     * @date 2021/8/26 11:00:09
     */
    default String getDomainNameBySpaceId(String spaceId) {
        return getDomainNameBySpaceId(spaceId, false);
    }

    /**
     * 从配置文件获取空间的默认域名
     *
     * @return 公网域名
     * @author Pengap
     * @date 2021/8/27 18:54:53
     */
    String getSpaceDefaultDomainName();

    /**
     * 获取空间站Id
     *
     * @param domainName    企业域名
     * @return spaceId
     * @author Pengap
     * @date 2021/8/26 11:00:13
     */
    String getSpaceIdByDomainName(String domainName);

    /**
     * 批量获取空间站域名
     *
     * @param spaceIds 空间Ids
     * @return 空间站对应域名（不过滤状态）
     * @author Pengap
     * @date 2021/8/31 10:44:03
     */
    List<SpaceBindDomainDTO> getSpaceDomainBySpaceIds(List<String> spaceIds);

    /**
     * 批量获取空间站域名
     *
     * @param spaceIds   空间Ids
     * @return key:空间站Id，value:空间站绑定域名
     * @author Pengap
     * @date 2021/8/26 14:35:25
     */
    Map<String, String> getSpaceDomainBySpaceIdsToMap(List<String> spaceIds);

    /**
     * 获取域名绑定空间状态
     *
     * @param domainName 域名
     * @return 域名绑定信息
     * @author Pengap
     * @date 2021/9/8 16:40:20
     */
    SpaceBindDomainDTO getSpaceDomainByDomainName(String domainName);

}
