package com.vikadata.api.component.http;

/**
 *
 * @author Shawn Deng
 * @date 2021-01-26 16:11:02
 */
public interface HttpTraceLogRepository {

    /**
     * 保存日志
     * @param traceLog Http 日志
     */
    void save(HttpTraceLog traceLog);
}
