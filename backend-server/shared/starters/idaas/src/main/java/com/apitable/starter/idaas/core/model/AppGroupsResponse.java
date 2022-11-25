package com.apitable.starter.idaas.core.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * Get the user group under the application
 * </p>
 *
 */
@Setter
@Getter
public class AppGroupsResponse {

    private Integer total;

    private List<AppGroupResponse> data;

    @Setter
    @Getter
    public static class AppGroupResponse {

        private String id;

        private String name;

        private String type;

        /**
         * User Group Sort
         *
         * <p>
         * Note: The interface itself does not return the sorting value.
         * It is convenient to synchronize to the VIKA for sorting.
         * </p>
         */
        private Integer order;

    }

}
