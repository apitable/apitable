package com.vikadata.api.modular.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.vikadata.api.model.dto.user.ThirdPartyMemberInfo;
import com.vikadata.api.model.dto.wechat.WechatMemberDto;
import com.vikadata.entity.ThirdPartyMemberEntity;
import org.apache.ibatis.annotations.Param;

/**
 * <p>
 * 第三方系统-会员信息表 Mapper 接口
 * </p>
 *
 * @author Chambers
 * @date 2020/8/10
 */
public interface ThirdPartyMemberMapper extends BaseMapper<ThirdPartyMemberEntity> {

    /**
     * 查询 unionId
     *
     * @param appId  appId
     * @param openId openId
     * @param type   类型
     * @return unionId
     * @author Chambers
     * @date 2020/8/10
     */
    String selectUnionIdByOpenIdAndType(@Param("appId") String appId, @Param("openId") String openId, @Param("type") Integer type);

    /**
     * 查询昵称
     *
     * @param appId   appId
     * @param unionId unionId
     * @param type    类型
     * @return nickName
     * @author Chambers
     * @date 2020/8/11
     */
    String selectNickNameByUnionIdAndType(@Param("appId") String appId, @Param("unionId") String unionId, @Param("type") Integer type);

    /**
     * 查询 extra
     *
     * @param id 会员ID
     * @return extra
     * @author Chambers
     * @date 2020/9/10
     */
    String selectExtraById(@Param("id") Long id);

    /**
     * 查询session_key
     *
     * @param id 会员ID
     * @return session_key
     * @author Chambers
     * @date 2020/2/24
     */
    String selectSessionKeyById(@Param("id") Long id);

    /**
     * 查询会员信息
     *
     * @param appId   appId
     * @param unionId unionId
     * @param type    类型
     * @return info
     * @author Chambers
     * @date 2020/8/14
     */
    ThirdPartyMemberInfo selectInfo(@Param("appId") String appId, @Param("unionId") String unionId, @Param("type") Integer type);

    /**
     * 获取绑定的用户ID
     *
     * @param id       会员ID
     * @param linkType 关联的第三方类型
     * @return userId
     * @author Chambers
     * @date 2020/2/27
     */
    Long selectUserIdByIdAndLinkType(@Param("id") Long id, @Param("linkType") Integer linkType);

    /**
     * 查询微信会员信息
     *
     * @param type   类型
     * @param appId  appId
     * @param openId openId
     * @return Dto
     * @author Chambers
     * @date 2020/2/22
     */
    WechatMemberDto selectWechatMemberDto(@Param("type") Integer type, @Param("appId") String appId, @Param("openId") String openId);

    /**
     * 查询用户ID及关联的微信会员信息
     *
     * @param appId  appId
     * @param mobile 手机号
     * @return Dto
     * @author Chambers
     * @date 2020/2/24
     */
    WechatMemberDto selectUserLinkedWechatMemberDto(@Param("appId") String appId, @Param("mobile") String mobile);
}
