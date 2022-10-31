package com.vikadata.social.service.dingtalk.config.configure;

import java.time.LocalDateTime;

import cn.hutool.core.date.DateUtil;
import cn.hutool.core.util.StrUtil;
import com.p6spy.engine.spy.appender.MessageFormattingStrategy;

public class P6spySqlFormatConfigure implements MessageFormattingStrategy {

    @Override
    public String formatMessage(int connectionId, String now, long elapsed, String category, String prepared, String sql, String url) {
        return StrUtil.isNotBlank(sql) ?
                StrUtil.format("P6spy-SQL performance analysis: Connection Url: {}, Connection ID: {}, execution time: {} | Time consuming: {} ms | SQL statement: {}{} ;",
                        url, connectionId,
                        DateUtil.format(LocalDateTime.now(), "yyyy-MM-dd HH:mm:ss"),
                        elapsed,
                        StrUtil.LF,
                        sql.replaceAll("[\\s]+", StrUtil.SPACE))
                :
                StrUtil.EMPTY;
    }
}
