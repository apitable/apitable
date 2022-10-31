package com.vikadata.integration.idaas.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * Get the list of user groups
 * </p>
 *
 */
@Setter
@Getter
public class GroupsRequest {

    /**
     * start page number. start from 0
     */
    @JsonProperty("page_index")
    private Integer pageIndex;

    /**
     * page size
     */
    @JsonProperty("page_size")
    private Integer pageSize;

    /**
     * sort field, preceded by {@code _} indicates ascending order, otherwise descending order
     */
    @JsonProperty("order_by")
    private List<String> orderBy;

}
