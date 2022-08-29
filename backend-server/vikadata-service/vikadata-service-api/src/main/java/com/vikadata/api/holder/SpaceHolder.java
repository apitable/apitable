package com.vikadata.api.holder;

import com.vikadata.api.lang.SpaceGlobalFeature;

/**
 * <p>
 * 当前请求的所在空间ID的临时保存容器
 * 说明：
 * 当OPEN_UP_FLAG标识在ThreadLocal里为true
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/10/29 16:10
 */
public class SpaceHolder {

    private static final ThreadLocal<Boolean> OPEN_UP_FLAG = new ThreadLocal<>();
    private static final ThreadLocal<String> SPACE_HOLDER = new ThreadLocal<>();

    private static final ThreadLocal<SpaceGlobalFeature> SPACE_GLOBAL_FEATURE = new ThreadLocal<>();

    /**
     * 初始化
     */
    public static void init() {
        OPEN_UP_FLAG.set(true);
    }

    /**
     * 这个方法如果OPEN_UP_FLAG标识没开启，则会set失效
     *
     * @param spaceId 当前登录用户
     * @author Shawn Deng
     * @date 2019/10/29 16:10
     */
    public static void set(String spaceId) {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag != null && openUpFlag.equals(true)) {
            SPACE_HOLDER.set(spaceId);
        }
    }

    /**
     * 这个方法如果OPEN_UP_FLAG标识没开启，则会get值为null
     *
     * @return LoginUser
     * @author Shawn Deng
     * @date 2019/10/29 16:11
     */
    public static String get() {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag == null || openUpFlag.equals(false)) {
            return null;
        } else {
            return SPACE_HOLDER.get();
        }
    }

    public static void setGlobalFeature(SpaceGlobalFeature feature) {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag != null && openUpFlag.equals(true)) {
            SPACE_GLOBAL_FEATURE.set(feature);
        }
    }

    public static SpaceGlobalFeature getGlobalFeature() {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag == null || openUpFlag.equals(false)) {
            return null;
        } else {
            return SPACE_GLOBAL_FEATURE.get();
        }
    }

    /**
     * 删除临时保存的用户
     *
     * @author Shawn Deng
     * @date 2019/10/29 16:11
     */
    public static void remove() {
        OPEN_UP_FLAG.remove();
        SPACE_HOLDER.remove();
        SPACE_GLOBAL_FEATURE.remove();
    }
}
