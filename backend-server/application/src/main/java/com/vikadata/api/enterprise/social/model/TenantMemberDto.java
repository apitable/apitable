package com.vikadata.api.enterprise.social.model;

import lombok.Data;

/**
 * <p>
 * Basic information of the third party
 * </p>
 */
@Data
public class TenantMemberDto {

    private Long memberId;

    private String openId;

    private String memberName;

    private Boolean isDeleted;

}
