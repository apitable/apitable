package com.vikadata.api.model.dto.player;

import lombok.Data;

/**
 * <p>
 * 用户基本信息
 * </p>
 *
 * @author zoe zheng
 * @date 2020/10/13 3:41 下午
 */
@Data
public class PlayerBaseDto {
    private String uuid;

    private Long memberId;

    private String userName;

    private String memberName;

    private String avatar;

    private String team;

    /**
     * 用户（user）是否修改过昵称
     */
    private Boolean isNickNameModified;

    /**
     * 成员（member）是否修改过昵称
     */
    private Boolean isMemberNameModified;

    private String email;

    private Boolean isMemberDeleted;
}
