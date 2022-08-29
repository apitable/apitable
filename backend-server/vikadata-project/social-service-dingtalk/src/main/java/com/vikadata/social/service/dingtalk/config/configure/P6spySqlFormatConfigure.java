package com.vikadata.social.service.dingtalk.config.configure;

import java.time.LocalDateTime;

import cn.hutool.core.date.DateUtil;
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
            StrUtil.format("P6spy-SQL性能分析：Connection Url：{}, Connection ID：{}, 执行时间：{} | 耗时：{} ms | SQL 语句：{}{} ;",
                    url, connectionId,
                    DateUtil.format(LocalDateTime.now(), "yyyy-MM-dd HH:mm:ss"),
                    elapsed,
                    StrUtil.LF,
                    sql.replaceAll("[\\s]+", StrUtil.SPACE))
            :
            StrUtil.EMPTY;
    }
}
