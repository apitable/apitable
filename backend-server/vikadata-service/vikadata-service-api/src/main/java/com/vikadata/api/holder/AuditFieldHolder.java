package com.vikadata.api.holder;

import com.vikadata.api.component.audit.AuditInfoField;

/**
 * <p>
 * 审计字段临时保存标识
 * 说明：
 * 当OPEN_UP_FLAG标识在ThreadLocal里为true
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/29 16:10
 */
@Deprecated
public class AuditFieldHolder {

    private static final ThreadLocal<Boolean> OPEN_UP_FLAG = new ThreadLocal<>();
    private static final ThreadLocal<AuditInfoField> HOLDER = new ThreadLocal<>();

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
    public static void set(AuditInfoField val) {
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
    public static AuditInfoField get() {
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
