package com.vikadata.api.modular.social.mapper;

import java.time.LocalDateTime;
import java.util.List;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.entity.SocialWecomPermitOrderAccountEntity;

/**
 * <p>
 * 企微服务商接口许可账号信息
 * </p>
 * @author 刘斌华
 * @date 2022-06-27 18:47:15
 */
@Mapper
public interface SocialWecomPermitOrderAccountMapper extends BaseMapper<SocialWecomPermitOrderAccountEntity> {

    /**
     * 获取接口许可账号信息
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param activeCodes 激活码列表
     * @return 激活账号信息
     * @author 刘斌华
     * @date 2022-06-30 14:01:15
     */
    List<SocialWecomPermitOrderAccountEntity> selectByActiveCodes(@Param("suiteId") String suiteId, @Param("authCorpId") String authCorpId,
            @Param("activeCodes") List<String> activeCodes);

    /**
     * 查询在指定时间前过期的账号
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param expireTime 指定的时间
     * @return 在指定时间前过期的账号
     * @author 刘斌华
     * @date 2022-07-28 14:56:33
     */
    List<SocialWecomPermitOrderAccountEntity> selectByExpireTime(@Param("suiteId") String suiteId, @Param("authCorpId") String authCorpId,
            @Param("expireTime") LocalDateTime expireTime);

    /**
     * 查询激活码
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param activateStatuses 账号激活状态。为空则查询全部
     * @return 符合条件的全部激活码
     * @author 刘斌华
     * @date 2022-06-29 18:10:34
     */
    List<String> selectActiveCodes(@Param("suiteId") String suiteId, @Param("authCorpId") String authCorpId,
            @Param("activateStatuses") List<Integer> activateStatuses);

    /**
     * 查询激活码
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param activeCodes 激活码列表
     * @param activateStatuses 账号激活状态。为空则查询全部
     * @return 符合条件的全部激活码
     * @author 刘斌华
     * @date 2022-06-29 18:10:34
     */
    List<String> selectActiveCodesByActiveCodesAndStatus(@Param("suiteId") String suiteId, @Param("authCorpId") String authCorpId,
            @Param("activeCodes") List<String> activeCodes, @Param("activateStatuses") List<Integer> activateStatuses);

    /**
     * 查询企微用户 ID
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param activateStatuses 账号激活状态。为空则查询全部
     * @return 已激活的企微用户 ID 列表
     * @author 刘斌华
     * @date 2022-07-01 18:31:27
     */
    List<String> selectCpUserIdsByStatus(@Param("suiteId") String suiteId, @Param("authCorpId") String authCorpId,
            @Param("activateStatuses") List<Integer> activateStatuses);

    /**
     * 批量变更激活状态
     *
     * @param suiteId 应用套件 ID
     * @param authCorpId 授权的企业 ID
     * @param activeCodes 激活码列表
     * @param activeStatus 变更后的状态
     * @return 更改的数量
     * @author 刘斌华
     * @date 2022-06-30 11:20:59
     */
    int updateActiveStatusByActiveCodes(@Param("suiteId") String suiteId, @Param("authCorpId") String authCorpId,
            @Param("activeCodes") List<String> activeCodes, @Param("activeStatus") Integer activeStatus);

}
