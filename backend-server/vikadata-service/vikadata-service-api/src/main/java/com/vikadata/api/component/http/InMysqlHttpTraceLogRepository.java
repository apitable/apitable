package com.vikadata.api.component.http;

import org.springframework.stereotype.Component;

/**
 *
 * @author Shawn Deng
 * @date 2021-01-26 16:40:20
 */
@Component
public class InMysqlHttpTraceLogRepository implements HttpTraceLogRepository{

    @Override
    public void save(HttpTraceLog traceLog) {

    }
}
