package com.vikadata.api.model.dto.organization;

import lombok.Data;

/**
 * <p>
 * 邀请通知邮件视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/11 14:58
 */
@Data
public class InviteNotifyDto {

    /**
     * 邀请人
     */
    private String fromUser;

    /**
     * 邀请人邮箱
     */
    private String fromEmail;

    /**
     * 邀请空间
     */
    private String spaceName;

    /**
     * 系统链接
     */
    private String url;

    /**
     * 年份
     */
    private int years;
}
