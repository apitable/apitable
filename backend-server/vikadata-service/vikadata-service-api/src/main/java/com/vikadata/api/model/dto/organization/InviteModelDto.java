package com.vikadata.api.model.dto.organization;

import lombok.Data;

/**
 * <p>
 * 邀请链接邮件视图
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/11 14:58
 */
@Data
public class InviteModelDto {

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
     * 邀请链接
     */
    private String inviteUrl;

    /**
     * 有效天数
     */
    private Integer validateDay;

    /**
     * 年份
     */
    private int years;
}
