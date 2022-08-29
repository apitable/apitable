package com.vikadata.api.listener;

/**
 * 程序启动成功后的钩子监听器，实现它完成各种需要定制化的初始化操作
 * @author Shawn Deng
 * @date 2021-11-12 10:24:44
 */
public interface OnReadyListener {

    /**
     * 初始化
     * @throws Exception 异常
     */
    void init() throws Exception;
}
