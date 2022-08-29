package com.vikadata.api.config.configure;

import java.time.format.DateTimeFormatter;

import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.LocalDateTimeUtil;
import cn.hutool.core.util.StrUtil;
import com.p6spy.engine.spy.appender.MessageFormattingStrategy;

/**
 * <p>
 * 自定义 p6spy sql输出格式
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/2/18 14:20
 */
public class P6spySqlFormatConfigure implements MessageFormattingStrategy {

    @Override
    public String formatMessage(int connectionId, String now, long elapsed, String category, String prepared, String sql, String url) {
        return StrUtil.isNotBlank(sql) ?
                StrUtil.format("SQL性能分析：\nConnection Url：{} \nConnection ID：{} \n执行时间：{} \n耗时：{} ms \nSQL 语句：{} ;",
                        url,
                        connectionId,
                        LocalDateTimeUtil.of(Long.parseLong(now)).format(DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_MS_PATTERN)),
                        elapsed,
                        sql.replaceAll("[\\s]+", StrUtil.SPACE))
                :
                StrUtil.EMPTY;
    }
}
