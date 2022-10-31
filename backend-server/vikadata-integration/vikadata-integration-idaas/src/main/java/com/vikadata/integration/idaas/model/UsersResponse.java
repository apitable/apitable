package com.vikadata.integration.idaas.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * Get Personnel List
 * </p>
 *
 */
@Setter
@Getter
public class UsersResponse {

    /**
     * total number of filtered results
     */
    private Integer total;

    /**
     * filtered page data
     */
    private List<UserResponse> data;

    @Setter
    @Getter
    public static class UserResponse {

        private String id;

        private String tenantId;

        private Long modifiedOn;

        private Long createdOn;

        private String objectType;

        private Values values;

        @Setter
        @Getter
        public static class Values {

            private String username;

            private String displayName;

            private String primaryMail;

            private String deptId;

            private List<String> groups;

            private String phoneNum;

            private String status;

        }

    }

}
