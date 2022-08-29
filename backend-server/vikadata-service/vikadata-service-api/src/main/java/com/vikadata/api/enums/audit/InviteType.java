package com.vikadata.api.enums.audit;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * <p>
 * 受邀类型
 * </p>
 *
 * @author Chambers
 * @date 2020/3/25
 */
@Getter
@AllArgsConstructor
public enum InviteType {

    /**
     * 邮箱邀请
     */
    EMAIL_INVITE(0),

    /**
     * 文件导入
     */
    FILE_IMPORT(1),

    /**
     * 链接邀请
     */
    LINK_INVITE(2);


    private final int type;
}
