package com.vikadata.api.modular.organization.model;

import java.util.List;

import lombok.Data;

/**
 * <p>
 * 成员/部门查找参数
 * </p>
 * @author zoe zheng
 * @date 2022/8/23 17:37
 */
@Data
public class LoadSearchDTO {

    private String keyword;

    private String linkId;

    private List<Long> unitIds;

    private List<Long> filterIds;

    private Boolean all;

    /**
     * 是否搜索邮件
     */
    private Boolean searchEmail;
}
