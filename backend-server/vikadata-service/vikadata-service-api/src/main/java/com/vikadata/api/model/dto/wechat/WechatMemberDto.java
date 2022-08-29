package com.vikadata.api.model.dto.wechat;

import lombok.Data;

/**
 * <p>
 * 微信成员dto
 * </p>
 *
 * @author Chambers
 * @date 2020/2/22
 */
@Data
public class WechatMemberDto {

    /**
     * 微信会员ID
     */
    private Long id;

    /**
     * 关联的用户ID
     */
    private Long userId;

    /**
     * 手机号
     */
    private String mobile;

    /**
     * 微信信息是否存在 union_id
     */
    private Boolean hasUnion;

    /**
     * 是否存在关联记录
     */
    private Boolean hasLink;
}
