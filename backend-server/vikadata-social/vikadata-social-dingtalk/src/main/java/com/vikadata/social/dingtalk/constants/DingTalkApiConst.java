package com.vikadata.social.dingtalk.constants;

/**
 * <p>
 * 接口地址
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/28 20:28
 */
public class DingTalkApiConst {
    public static final Integer SEND_MESSAGE_USER_MAX_COUNT = 1000;

    public static final Integer SEND_MESSAGE_BY_ID_MAX_COUNT = 5000;

    /**
     * 基础URL
     */
    private static final String DEFAULT_BASE_URL = "https://oapi.dingtalk.com";

    /**
     * 获取企业凭证
     */
    public static final String GET_CORP_TOKEN = DEFAULT_BASE_URL + "/service/get_corp_token";

    /**
     * 获取企业授权信息
     */
    public static final String GET_AUTH_INFO = DEFAULT_BASE_URL + "/service/get_auth_info";

    /**
     * 获取企业应用信息
     */
    public static final String GET_AGENT = DEFAULT_BASE_URL + "/service/get_agent";

    /**
     * 获取第三方应用凭证
     */
    public static final String GET_SUITE_TOKEN = DEFAULT_BASE_URL + "/service/get_suite_token";

    /**
     * 第三方企业应用免登 获取免登授权码
     */
    public static final String GET_USER_INFO = DEFAULT_BASE_URL + "/user/getuserinfo";

    /**
     * 登陆第三方网站相关 服务端通过临时授权码获取授权用户的个人信息
     */
    public static final String GET_USER_INFO_BY_CODE = DEFAULT_BASE_URL + "/sns/getuserinfo_bycode";

    /**
     * 部门管理
     */
    public static class Department {
        /**
         * 获取子部门ID列表
         */
        public static final String GET_DEPT_ID_LIST = DEFAULT_BASE_URL + "/department/list_ids";

        /**
         * 获取部门列表
         */
        public static final String DEPARTMENT_LIST = DEFAULT_BASE_URL + "/department/list";

        /**
         * 获取部门详情
         */
        public static final String GET_DEPT = DEFAULT_BASE_URL + "/department/get";

        /**
         * 查询部门的所有上级父部门路径
         */
        public static final String GET_DEPT_PARENT_LIST = DEFAULT_BASE_URL + "/department/list_parent_depts_by_dept";

        /**
         * 查询指定用户的所有上级父部门路径
         */
        public static final String GET_DEPT_PARENT_LISTS = DEFAULT_BASE_URL + "/department/list_parent_depts";
    }

    /**
     * 用户管理
     */
    public static class User {
        /**
         * 获取用户详情
         */
        public static final String GET_USER = DEFAULT_BASE_URL + "/user/get";

        /**
         * 获取部门用户userid列表
         */
        public static final String GET_DEPT_MEMBER = DEFAULT_BASE_URL + "/user/getDeptMember";

        /**
         * 获取部门用户
         */
        public static final String GET_SIMPLE_LIST = DEFAULT_BASE_URL + "/user/simplelist";

        /**
         * 获取部门用户详情
         */
        public static final String GET_LIST_BY_PAGE = DEFAULT_BASE_URL + "/user/listbypage";

        /**
         * 获取管理员列表
         */
        public static final String GET_ADMIN = DEFAULT_BASE_URL + "/user/get_admin";

        /**
         * 获取管理员通讯录权限范围
         */
        public static final String GET_ADMIN_SCOPE = DEFAULT_BASE_URL + "/user/get_admin_scope";

        /**
         * 查询管理员是否具备管理某个应用的权限
         */
        public static final String GET_CAN_ACCESS_MICRO_APP = DEFAULT_BASE_URL + "/user/can_access_microapp";

        /**
         * 根据unionid获取userid
         */
        public static final String GET_USERID_BY_UNIONID = DEFAULT_BASE_URL + "/user/getUseridByUnionid";

        /**
         * 获取企业员工人数
         */
        public static final String GET_ORG_USER_COUNT = DEFAULT_BASE_URL + "/user/get_org_user_count";
    }

    /**
     * 角色管理
     */
    public static class Role {

        /**
         * 获取角色列表
         */
        public static final String GET_ROLE_LIST = DEFAULT_BASE_URL + "/topapi/role/list";

        /**
         * 获取角色下的员工列表
         */
        public static final String GET_USER_LIST_BY_ROLE = DEFAULT_BASE_URL + "/topapi/role/simplelist";

        /**
         * 获取角色组
         */
        public static final String GET_ROLE_GROUP = DEFAULT_BASE_URL + "/topapi/role/getrolegroup";

        /**
         * 获取角色详情
         */
        public static final String GET_ROLE = DEFAULT_BASE_URL + "/topapi/role/getrole";

    }
}
