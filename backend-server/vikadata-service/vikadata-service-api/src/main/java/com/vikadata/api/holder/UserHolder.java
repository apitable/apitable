package com.vikadata.api.holder;

/**
 * <p>
 * 当前操作的用户的临时保存容器
 * 说明：
 * 当OPEN_UP_FLAG标识在ThreadLocal里为true
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/29 16:10
 */
public class UserHolder {

    private static final ThreadLocal<Boolean> OPEN_UP_FLAG = new ThreadLocal<>();
    private static final ThreadLocal<Long> HOLDER = new ThreadLocal<>();

    /**
     * 初始化
     */
    public static void init() {
        OPEN_UP_FLAG.set(true);
    }

    /**
     * 这个方法如果OPEN_UP_FLAG标识没开启，则会set失效
     *
     * @param userId 成员ID
     * @author Shawn Deng
     * @date 2019/10/29 16:10
     */
    public static void set(Long userId) {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag != null && openUpFlag.equals(true)) {
            HOLDER.set(userId);
        }
    }

    /**
     * 这个方法如果OPEN_UP_FLAG标识没开启，则会get值为null
     *
     * @return userId
     * @author Shawn Deng
     * @date 2019/10/29 16:11
     */
    public static Long get() {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag == null || openUpFlag.equals(false)) {
            return null;
        } else {
            return HOLDER.get();
        }
    }

    /**
     * 清空
     *
     * @author Shawn Deng
     * @date 2019/10/29 16:11
     */
    public static void remove() {
        OPEN_UP_FLAG.remove();
        HOLDER.remove();
    }
}
