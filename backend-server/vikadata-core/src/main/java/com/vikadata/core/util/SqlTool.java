package com.vikadata.core.util;

/**
 * <p>
 * SQL 工具类
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/3 20:08
 */
public class SqlTool {

    /**
     * 返回SelectCount执行结果
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
