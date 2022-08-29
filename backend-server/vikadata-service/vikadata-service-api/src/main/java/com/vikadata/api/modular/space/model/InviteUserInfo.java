package com.vikadata.api.modular.space.model;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;
import lombok.Data;

/**
 * <p>
 *     被邀请用户信息
 * </p>
 *
 * @author liuzijing
 * @date 2022/8/23
 */
@Data
public class InviteUserInfo {

    /**
     * 用户Id
     */
    private String userId;

    /**
     * 用户名
     */
    private String userName;

    /**
     * 头像
     */
    @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
    private String avatar;
}
