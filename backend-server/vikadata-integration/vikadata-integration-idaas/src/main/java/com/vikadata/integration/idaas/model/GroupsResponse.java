package com.vikadata.integration.idaas.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * Get the list of user group
 * </p>
 *
 */
@Setter
@Getter
public class GroupsResponse {

    private Integer total;

    private List<GroupResponse> data;

    @Setter
    @Getter
    public static class GroupResponse {

        private String id;

        private String name;

        private String type;

        /**
         * User Group Sort
         *
         * <p>
         * Note: The interface itself does not return the sort value, here is convenient to synchronize to the VIKA for sorting use
         * </p>
         */
        private Integer order;

    }

}
