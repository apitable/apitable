/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.shared.config.configure;

import cn.hutool.core.date.DatePattern;
import cn.hutool.core.date.LocalDateTimeUtil;
import cn.hutool.core.util.StrUtil;
import com.p6spy.engine.spy.appender.MessageFormattingStrategy;
import java.time.format.DateTimeFormatter;

/**
 * <p>
 * p6spy sql formatter.
 * </p>
 *
 * @author Shawn Deng
 */
public class P6spySqlFormatConfigure implements MessageFormattingStrategy {

    @Override
    public String formatMessage(int connectionId, String now, long elapsed, String category,
                                String prepared, String sql, String url) {
        return StrUtil.isNotBlank(sql)
            ? StrUtil.format(
            "SQL Performance Analyzer ：\nConnection Url：{} \nConnection ID：{} \nexecution time：{} \ntaken time：{} ms \nSQL：{} ;",
            url,
            connectionId,
            LocalDateTimeUtil.of(Long.parseLong(now))
                .format(DateTimeFormatter.ofPattern(DatePattern.NORM_DATETIME_MS_PATTERN)),
            elapsed,
            sql.replaceAll("[\\s]+", StrUtil.SPACE))
            :
            StrUtil.EMPTY;
    }
}
