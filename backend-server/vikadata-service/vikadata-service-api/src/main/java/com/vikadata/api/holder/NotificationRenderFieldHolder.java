package com.vikadata.api.holder;

import com.vikadata.api.component.notification.NotificationRenderField;

/**
 * <p>
 * 通知临时保存字段
 * </p>
 *
 * @author zoe zheng
 * @date 2020/6/15 4:24 下午
 */
public class NotificationRenderFieldHolder {

    private static final ThreadLocal<Boolean> OPEN_UP_FLAG = new ThreadLocal<>();
    private static final ThreadLocal<NotificationRenderField> HOLDER = new ThreadLocal<>();

    /**
     * 初始化
     */
    public static void init() {
        OPEN_UP_FLAG.set(true);
    }

    /**
     * 这个方法如果OPEN_UP_FLAG标识没开启，则会set失效
     *
     * @param val 当前登录用户
     * @author Shawn Deng
     * @date 2019/10/29 16:10
     */
    public static void set(NotificationRenderField val) {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag != null && openUpFlag.equals(true)) {
            HOLDER.set(val);
        }
    }

    /**
     * 这个方法如果OPEN_UP_FLAG标识没开启，则会get值为null
     *
     * @return AuditInfoField
     * @author Shawn Deng
     * @date 2019/10/29 16:11
     */
    public static NotificationRenderField get() {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag == null || openUpFlag.equals(false)) {
            return null;
        } else {
            return HOLDER.get();
        }
    }

    /**
     * 删除
     *
     * @author Shawn Deng
     * @date 2019/10/29 16:11
     */
    public static void remove() {
        OPEN_UP_FLAG.remove();
        HOLDER.remove();
    }
}
