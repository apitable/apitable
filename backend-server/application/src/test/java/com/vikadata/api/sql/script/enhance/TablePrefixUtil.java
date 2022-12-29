package com.vikadata.api.sql.script.enhance;

import java.util.ArrayList;
import java.util.List;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.toolkit.TableNameParser;
import com.baomidou.mybatisplus.core.toolkit.TableNameParser.SqlToken;

public class TablePrefixUtil {

    public static String changeTablePrefix(String sql, String tablePrefix) {
        TableNameParser parser = new TableNameParser(sql);
        List<SqlToken> names = new ArrayList<>();
        parser.accept(names::add);
        StringBuilder builder = new StringBuilder();
        int last = 0;
        for (TableNameParser.SqlToken name : names) {
            int start = name.getStart();
            if (start != last) {
                builder.append(sql, last, start);
                builder.append(tablePrefix);
                String tableName = name.getValue();
                if (StrUtil.startWith(tableName, '`') && StrUtil.endWith(tableName, '`')) {
                    builder.append(tableName.replace("`", ""));
                } else {
                    builder.append(tableName);
                }
            }
            last = name.getEnd();
        }
        if (last != sql.length()) {
            builder.append(sql.substring(last));
        }
        return builder.toString();
    }

}
