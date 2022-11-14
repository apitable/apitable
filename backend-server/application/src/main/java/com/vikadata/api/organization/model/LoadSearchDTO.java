package com.vikadata.api.organization.model;

import java.util.List;

import lombok.Data;

/**
 * <p>
 * parameter for searching member or department
 * </p>
 */
@Data
public class LoadSearchDTO {

    private String keyword;

    private String linkId;

    private List<Long> unitIds;

    private List<Long> filterIds;

    private Boolean all;

    /**
     * whether to search for emails
     */
    private Boolean searchEmail;
}
