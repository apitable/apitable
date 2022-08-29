package com.vikadata.api.model.dto.user;

import lombok.Data;

/**
 * <p>
 * 第三方会员信息
 * </p>
 *
 * @author Chambers
 * @date 2020/8/25
 */
@Data
public class ThirdPartyMemberInfo {

    /**
     * 表ID
     */
    private Long id;

    /**
     * 昵称
     */
    private String nickName;

    /**
     * 头像
     */
    private String avatar;
}
