package com.vikadata.api.modular.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialCpUserBindEntity;

/**
 * <p>
 * 第三方平台集成-企业微信用户绑定 Mapper
 * </p>
 * @author Pengap
 * @date 2021/8/5 20:26:13
 */
public interface SocialCpUserBindMapper extends BaseMapper<SocialCpUserBindEntity> {

    /**
     * 查询用户ID
     *
     * @param cpTenantUserId    第三方平台用户标识（SocialCpTenantUser#ID）
     * @return 用户ID
     * @author Pengap
     * @date 2021/8/18 18:43:44
     */
    Long selectUserIdByCpTenantUserId(@Param("cpTenantUserId") Long cpTenantUserId);

    /**
     * 批量获取信息
     *
     * @param cpTenantUserIds 第三方平台用户标识（SocialCpTenantUser#ID）
     * @return 信息列表
     * @author 刘斌华
     * @date 2022-04-13 17:48:31
     */
    List<SocialCpUserBindEntity> selectByCpTenantUserIds(@Param("cpTenantUserIds") List<Long> cpTenantUserIds);

    /**
     * 查询用户ID
     *
     * @param tenantId  企业Id
     * @param cpUserId  应用用户Id
     * @return 用户ID
     * @author Pengap
     * @date 2021/8/23 16:31:06
     */
    Long selectUserIdByTenantIdAndCpUserId(@Param("tenantId") String tenantId, @Param("cpUserId") String cpUserId);

    /**
     * 获取OpenId
     *
     * @param tenantId  企业Id
     * @param userId    Vika用户ID
     * @return 企业微信OpenId
     * @author Pengap
     * @date 2021/9/17 17:28:24
     */
    String selectOpenIdByTenantIdAndUserId(@Param("tenantId") String tenantId, @Param("userId") Long userId);

    /**
     * 批量删除企业微信绑定关系
     *
     * @param removeCpTenantUserIds 第三方平台用户唯一标识（SocialCpTenantUser#ID）
     * @return int 影响行数
     * @author Pengap
     * @date 2021/8/25 18:29:13
     */
    int batchDeleteByCpTenantUserIds(@Param("removeCpTenantUserIds") List<Long> removeCpTenantUserIds);

    /**
     * 统计指定租户下，指定用户出现数量
     *
     * @param tenantId    租户Id
     * @param userId      用户Id
     * @return 用户出现数量
     * @author Pengap
     * @date 2021/9/14 17:37:40
     */
    Long countTenantBindByUserId(@Param("tenantId") String tenantId, @Param("userId") Long userId);

    /**
     * 根据用户ID 物理删除
     * @param userId
     * @return
     */
    int deleteByUserId(@Param("userId") Long userId);
}
