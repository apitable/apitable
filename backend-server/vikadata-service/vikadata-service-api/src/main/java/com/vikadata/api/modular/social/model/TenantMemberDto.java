package com.vikadata.api.modular.social.model;

import lombok.Data;

/**
 * <p>
 * 成员第三方基本信息
 * </p>
 * @author zoe zheng
 * @date 2021/6/11 3:42 下午
 */
@Data
public class TenantMemberDto {

    private Long memberId;

    private String openId;

    private String memberName;

    private Boolean isDeleted;

}
