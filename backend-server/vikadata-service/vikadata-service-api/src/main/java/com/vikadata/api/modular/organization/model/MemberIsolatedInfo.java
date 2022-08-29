package com.vikadata.api.modular.organization.model;

import java.util.List;

import lombok.Data;

/**
 * <p>
 *  通讯录隔离成员信息
 * <p>
 *
 * @author liuzijing
 * @date 2022/5/17 18:06
 */
@Data
public class MemberIsolatedInfo {

    /**
     * 成员是否被隔离
     */
    private boolean isolated;

    /**
     * 成员所属部门ID
     */
    private List<Long> teamIds;
}
