package com.vikadata.api.modular.social.model;

import java.util.HashMap;
import java.util.Map;

import lombok.Data;

/**
 * <p>
 * Ding Talk User Information
 * </p>
 */
@Data
public class DingTalkContactDTO {

    private DingTalkDepartmentDTO department;

    private Map<String, DingTalkUserDTO> userMap = new HashMap<>();

    @Data
    public static class DingTalkUserDTO {

        private String openId;

        private String unionId;

        private String name;

        private String avatar;

        private String position;

        private Boolean active;

        private String mobile;

        private String email;

    }

    @Data
    public static class DingTalkDepartmentDTO {

        private String deptName;

        private Long deptId;

        private Long parentDeptId;
    }
}
