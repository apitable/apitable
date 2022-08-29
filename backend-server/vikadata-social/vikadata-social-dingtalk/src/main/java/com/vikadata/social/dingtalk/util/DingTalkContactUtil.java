package com.vikadata.social.dingtalk.util;

import java.util.List;

import com.vikadata.social.dingtalk.constants.DingTalkConst;

/**
 * <p>
 * 钉钉通讯录工具类
 * </p>
 * @author zoe zheng
 * @date 2021/9/14 10:41 上午
 */
public class DingTalkContactUtil {
    /**
     * 授权可见范围是否是全部用户
     *
     * @param deptIds 授权可见范围的部门ID
     * @param userIds 授权可见范围的用户ID
     * @return Boolean
     * @author zoe zheng
     * @date 2021/9/14 11:29 上午
     */
    public static Boolean isAllMembers(List<String> deptIds, List<String> userIds) {
        return userIds.isEmpty() && deptIds.get(0).equals(DingTalkConst.ROOT_DEPARTMENT_ID.toString());
    }

    /**
     * 授权可见范围是否只有部门
     *
     * @param deptIds 授权可见范围的部门ID
     * @param userIds 授权可见范围的用户ID
     * @return Boolean
     * @author zoe zheng
     * @date 2021/9/14 11:29 上午
     */
    public static Boolean isOnlyDept(List<String> deptIds, List<String> userIds) {
        return userIds.isEmpty() && !deptIds.get(0).equals(DingTalkConst.ROOT_DEPARTMENT_ID.toString());
    }

    /**
     * 授权可见范围是否只有用户
     *
     * @param deptIds 授权可见范围的部门ID
     * @param userIds 授权可见范围的用户ID
     * @return Boolean
     * @author zoe zheng
     * @date 2021/9/14 11:29 上午
     */
    public static Boolean isOnlyMember(List<String> deptIds, List<String> userIds) {
        return !userIds.isEmpty() && deptIds.isEmpty();
    }
}
