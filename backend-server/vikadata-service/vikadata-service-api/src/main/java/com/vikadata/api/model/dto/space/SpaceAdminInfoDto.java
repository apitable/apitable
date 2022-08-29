package com.vikadata.api.model.dto.space;

import lombok.Data;

/**
 * <p>
 * 空间主管理员信息dto
 * </p>
 *
 * @author Chambers
 * @date 2020/1/21
 */
@Data
public class SpaceAdminInfoDto {

    /**
     * 成员ID
     */
    private Long memberId;

    /**
     * 区号
     */
    private String areaCode;

    /**
     * 账号手机号
     */
    private String mobile;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 成员名称
     */
    private String memberName;

    /**
     * 空间名称
     */
    private String spaceName;
}
