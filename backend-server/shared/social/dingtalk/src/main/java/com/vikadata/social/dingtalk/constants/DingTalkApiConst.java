package com.vikadata.social.dingtalk.constants;

/**
 * interface address
 */
public class DingTalkApiConst {
    public static final Integer SEND_MESSAGE_USER_MAX_COUNT = 1000;

    public static final Integer SEND_MESSAGE_BY_ID_MAX_COUNT = 5000;

    /**
     * base URL
     */
    private static final String DEFAULT_BASE_URL = "https://oapi.dingtalk.com";

    /**
     * Get corporate credentials
     */
    public static final String GET_CORP_TOKEN = DEFAULT_BASE_URL + "/service/get_corp_token";

    /**
     * Obtain enterprise authorization information
     */
    public static final String GET_AUTH_INFO = DEFAULT_BASE_URL + "/service/get_auth_info";

    /**
     * Get enterprise application information
     */
    public static final String GET_AGENT = DEFAULT_BASE_URL + "/service/get_agent";

    /**
     * Obtain third-party application credentials
     */
    public static final String GET_SUITE_TOKEN = DEFAULT_BASE_URL + "/service/get_suite_token";

    /**
     * The third-party enterprise application is free to obtain a free authorization code
     */
    public static final String GET_USER_INFO = DEFAULT_BASE_URL + "/user/getuserinfo";

    /**
     * Log in to the third-party website The server obtains the personal information of the authorized user through the temporary authorization code
     */
    public static final String GET_USER_INFO_BY_CODE = DEFAULT_BASE_URL + "/sns/getuserinfo_bycode";

    /**
     * Department management
     */
    public static class Department {
        /**
         * Get a list of sub-department IDs
         */
        public static final String GET_DEPT_ID_LIST = DEFAULT_BASE_URL + "/department/list_ids";

        /**
         * Get department list
         */
        public static final String DEPARTMENT_LIST = DEFAULT_BASE_URL + "/department/list";

        /**
         * Get department details
         */
        public static final String GET_DEPT = DEFAULT_BASE_URL + "/department/get";

        /**
         * Query all parent parent department paths of a department
         */
        public static final String GET_DEPT_PARENT_LIST = DEFAULT_BASE_URL + "/department/list_parent_depts_by_dept";

        /**
         * Query all parent department paths of a specified user
         */
        public static final String GET_DEPT_PARENT_LISTS = DEFAULT_BASE_URL + "/department/list_parent_depts";
    }

    /**
     * User Management
     */
    public static class User {
        /**
         * Get user details
         */
        public static final String GET_USER = DEFAULT_BASE_URL + "/user/get";

        /**
         * Get userid list of department users
         */
        public static final String GET_DEPT_MEMBER = DEFAULT_BASE_URL + "/user/getDeptMember";

        /**
         * Get department users
         */
        public static final String GET_SIMPLE_LIST = DEFAULT_BASE_URL + "/user/simplelist";

        /**
         * Get department user details
         */
        public static final String GET_LIST_BY_PAGE = DEFAULT_BASE_URL + "/user/listbypage";

        /**
         * Get admin list
         */
        public static final String GET_ADMIN = DEFAULT_BASE_URL + "/user/get_admin";

        /**
         * Get administrator address book permission scope
         */
        public static final String GET_ADMIN_SCOPE = DEFAULT_BASE_URL + "/user/get_admin_scope";

        /**
         * Query whether the administrator has permission to manage an application
         */
        public static final String GET_CAN_ACCESS_MICRO_APP = DEFAULT_BASE_URL + "/user/can_access_microapp";

        /**
         * Get userid according to unionid
         */
        public static final String GET_USERID_BY_UNIONID = DEFAULT_BASE_URL + "/user/getUseridByUnionid";

        /**
         * Get the number of employees in the company
         */
        public static final String GET_ORG_USER_COUNT = DEFAULT_BASE_URL + "/user/get_org_user_count";
    }

    /**
     * Role management
     */
    public static class Role {

        /**
         * Get a list of roles
         */
        public static final String GET_ROLE_LIST = DEFAULT_BASE_URL + "/topapi/role/list";

        /**
         * Get a list of employees under a role
         */
        public static final String GET_USER_LIST_BY_ROLE = DEFAULT_BASE_URL + "/topapi/role/simplelist";

        /**
         * Get role group
         */
        public static final String GET_ROLE_GROUP = DEFAULT_BASE_URL + "/topapi/role/getrolegroup";

        /**
         * Get role details
         */
        public static final String GET_ROLE = DEFAULT_BASE_URL + "/topapi/role/getrole";

    }
}
