package com.vikadata.integration.idaas.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 获取人员列表
 * </p>
 * @author 刘斌华
 * @date 2022-05-13 17:12:19
 */
@Setter
@Getter
public class UsersResponse {

    /**
     * 筛选出的结果总数
     */
    private Integer total;

    /**
     * 筛选出的分页数据
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
