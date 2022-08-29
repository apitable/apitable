package com.vikadata.social.feishu;

import lombok.extern.slf4j.Slf4j;

/**
 * 当前sdk调用应用ID变量存储器，只存在于线程中
 * @author Shawn Deng
 * @date 2022-01-18 21:57:28
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
     * 此方法需要用户根据自己程序代码，在适当位置手动触发调用，本SDK里无法判断调用时机
     */
    public static void remove() {
        HOLDER.remove();
    }
}
