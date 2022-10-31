package com.vikadata.api.holder;

import com.vikadata.api.lang.SpaceGlobalFeature;

/**
 * <p>
 * Temporary storage container for the space ID of the current request
 * </p>
 *
 * @author Shawn Deng
 */
public class SpaceHolder {

    private static final ThreadLocal<Boolean> OPEN_UP_FLAG = new ThreadLocal<>();

    private static final ThreadLocal<String> SPACE_HOLDER = new ThreadLocal<>();

    private static final ThreadLocal<SpaceGlobalFeature> SPACE_GLOBAL_FEATURE = new ThreadLocal<>();

    public static void init() {
        OPEN_UP_FLAG.set(true);
    }

    public static void set(String spaceId) {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag != null && openUpFlag.equals(true)) {
            SPACE_HOLDER.set(spaceId);
        }
    }

    public static String get() {
        Boolean openUpFlag = OPEN_UP_FLAG.get();
        if (openUpFlag == null || openUpFlag.equals(false)) {
            return null;
        }
        else {
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
        }
        else {
            return SPACE_GLOBAL_FEATURE.get();
        }
    }

    public static void remove() {
        OPEN_UP_FLAG.remove();
        SPACE_HOLDER.remove();
        SPACE_GLOBAL_FEATURE.remove();
    }
}
