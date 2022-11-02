package com.vikadata.api.listener;

/**
 * The hook listener after the program starts successfully,
 * realize it to complete various initialization operations that need to be customized
 * @author Shawn Deng
 */
public interface OnReadyListener {

    /**
     * Initialization
     */
    void init();
}
