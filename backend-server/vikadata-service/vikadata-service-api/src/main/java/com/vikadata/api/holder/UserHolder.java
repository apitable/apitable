package com.vikadata.api.holder;

/**
 * <p>
 * Temporary save container for the currently operating user
 * </p>
 *
 * @author Shawn Deng
 */
public class UserHolder {

    private static final ThreadLocal<Boolean> OPEN_UP_FLAG = new ThreadLocal<>();

    private static final ThreadLocal<Long> HOLDER = new ThreadLocal<>();

    public static void init() {
        OPEN_UP_FLAG.set(true);
    }

    public static void set(Long userId) {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag != null && openUpFlag.equals(true)) {
            HOLDER.set(userId);
        }
    }

    public static Long get() {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag == null || openUpFlag.equals(false)) {
            return null;
        }
        else {
            return HOLDER.get();
        }
    }

    public static void remove() {
        OPEN_UP_FLAG.remove();
        HOLDER.remove();
    }
}
