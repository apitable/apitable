package com.vikadata.social.feishu;

import lombok.extern.slf4j.Slf4j;

/**
 * The current sdk calls the application variable memory, which only exists in the thread
 */
@Slf4j
public class FeishuConfigStorageHolder {

    private final static ThreadLocal<String> HOLDER = new ThreadLocal<>();

    public static void set(String appId) {
        HOLDER.set(appId);
    }

    public static String get() {
        return HOLDER.get();
    }

    /**
     * This method requires the user to manually trigger the call at the appropriate location
     * according to their own program code, and the timing of the call cannot be determined in this SDK
     */
    public static void remove() {
        HOLDER.remove();
    }
}
