package com.vikadata.api.modular.social.mapper;

import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialUserBindEntity;

/**
 * 第三方平台集成-用户绑定 Mapper
 *
 * @author Shawn Deng
 * @date 2020-12-08 16:22:34
 */
public interface SocialUserBindMapper extends BaseMapper<SocialUserBindEntity> {

    /**
     * 查询用户ID
     *
     * @param unionId 第三方用户标识
     * @return 用户ID
     * @author Shawn Deng
     * @date 2020/12/14 15:00
     */
    Long selectUserIdByUnionId(@Param("unionId") String unionId);

    /**
     * 查询用户ID
     *
     * @param userId 用户ID
     * @return 用户ID
     * @author Shawn Deng
     * @date 2020/12/14 15:00
     */
    List<String> selectUnionIdByUserId(@Param("userId") Long userId);

    /**
     * 根据UnionId查询
     *
     * @param unionIds 第三方平台用户标识
     * @return SocialUserBindEntity List
     * @author Shawn Deng
     * @date 2020/12/22 16:17
     */
    List<SocialUserBindEntity> selectByUnionIds(@Param("unionIds") List<String> unionIds);

    /**
     * 批量删除记录
     *
     * @param unionIds 第三方平台用户标识
     * @return 执行结果数
     * @author Shawn Deng
     * @date 2020/12/15 10:16
     */
    int deleteByUnionIds(@Param("unionIds") List<String> unionIds);

    /**
     * 根据用户ID 物理删除
     * @param userId
     * @return
     */
    int deleteByUserId(@Param("userId") Long userId);

    /**
     * 获取用户在企业的open_id
     * @param appId 应用标识
     * @param tenantId 租户标识
     * @param userId 用户
     * @return open id
     * @author Shawn Deng
     * @date 2021/8/16 23:38
     */
    String selectOpenIdByTenantIdAndUserId(@Param("appId") String appId, @Param("tenantId") String tenantId, @Param("userId") Long userId);
}
