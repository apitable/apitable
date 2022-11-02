package com.vikadata.core.util;

public class SqlTool {

    /**
     * return the execution result of SelectCount
     *
     * @param result ignore
     * @return int
     */
    public static long retCount(Long result) {
        return (null == result) ? 0 : result;
    }

    public static int retCount(Integer result) {
        return (null == result) ? 0 : result;
    }
}
