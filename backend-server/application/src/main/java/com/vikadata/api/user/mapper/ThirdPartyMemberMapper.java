package com.vikadata.api.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import org.apache.ibatis.annotations.Param;

import com.vikadata.api.user.dto.WechatMemberDto;
import com.vikadata.api.user.dto.ThirdPartyMemberInfo;
import com.vikadata.entity.ThirdPartyMemberEntity;

/**
 * <p>
 * Third party system - Mapper interface of member information table
 * </p>
 */
public interface ThirdPartyMemberMapper extends BaseMapper<ThirdPartyMemberEntity> {

    /**
     * Query unionId
     *
     * @param appId  appId
     * @param openId openId
     * @param type   Type
     * @return unionId
     */
    String selectUnionIdByOpenIdAndType(@Param("appId") String appId, @Param("openId") String openId, @Param("type") Integer type);

    /**
     * Query nickname
     *
     * @param appId   appId
     * @param unionId unionId
     * @param type    Type
     * @return nickName
     */
    String selectNickNameByUnionIdAndType(@Param("appId") String appId, @Param("unionId") String unionId, @Param("type") Integer type);

    /**
     * Query extra
     *
     * @param id Member ID
     * @return extra
     */
    String selectExtraById(@Param("id") Long id);

    /**
     * Query session key
     *
     * @param id Member ID
     * @return session_key
     */
    String selectSessionKeyById(@Param("id") Long id);

    /**
     * Query member information
     *
     * @param appId   appId
     * @param unionId unionId
     * @param type    Type
     * @return info
     */
    ThirdPartyMemberInfo selectInfo(@Param("appId") String appId, @Param("unionId") String unionId, @Param("type") Integer type);

    /**
     * Get the bind user ID
     *
     * @param id       Member ID
     * @param linkType Associated Third Party Type
     * @return userId
     */
    Long selectUserIdByIdAndLinkType(@Param("id") Long id, @Param("linkType") Integer linkType);

    /**
     * Query WeChat member information
     *
     * @param type   Type
     * @param appId  appId
     * @param openId openId
     * @return Dto
     */
    WechatMemberDto selectWechatMemberDto(@Param("type") Integer type, @Param("appId") String appId, @Param("openId") String openId);

    /**
     * Query user ID and associated WeChat member information
     *
     * @param appId  appId
     * @param mobile phone number
     * @return Dto
     */
    WechatMemberDto selectUserLinkedWechatMemberDto(@Param("appId") String appId, @Param("mobile") String mobile);
}
