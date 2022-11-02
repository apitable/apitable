package com.vikadata.api.model.dto.wechat;

import lombok.Data;

@Data
public class WechatMemberDto {

    private Long id;

    private Long userId;

    private String mobile;

    private Boolean hasUnion;

    private Boolean hasLink;
}
