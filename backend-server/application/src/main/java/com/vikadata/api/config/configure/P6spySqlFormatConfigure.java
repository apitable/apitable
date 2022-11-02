package com.vikadata.api.config.configure;

import java.time.format.DateTimeFormatter;

import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.LocalDateTimeUtil;
import cn.hutool.core.util.StrUtil;
import com.p6spy.engine.spy.appender.MessageFormattingStrategy;

/**
 * <p>
 * p6spy sql formatter
 * </p>
 *
 * @author Shawn Deng
 */
public class P6spySqlFormatConfigure implements MessageFormattingStrategy {

    @Override
    public String formatMessage(int connectionId, String now, long elapsed, String category, String prepared, String sql, String url) {
        return StrUtil.isNotBlank(sql) ?
                StrUtil.format("SQL Performance Analyzer ：\nConnection Url：{} \nConnection ID：{} \nexecution time：{} \ntaken time：{} ms \nSQL：{} ;",
                        url,
                        connectionId,
                        LocalDateTimeUtil.of(Long.parseLong(now)).format(DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_MS_PATTERN)),
                        elapsed,
                        sql.replaceAll("[\\s]+", StrUtil.SPACE))
                :
                StrUtil.EMPTY;
    }
}
