package com.vikadata.build.mybatis;

import java.util.Collections;

import com.baomidou.mybatisplus.generator.config.INameConvert;
import com.baomidou.mybatisplus.generator.config.po.TableField;
import com.baomidou.mybatisplus.generator.config.po.TableInfo;
import com.baomidou.mybatisplus.generator.config.rules.NamingStrategy;

/**
 *
 * @author Shawn Deng
 * @date 2021-11-05 11:07:57
 */
public class NameConvert implements INameConvert {

    @Override
    public String entityNameConvert(TableInfo tableInfo) {
        String tableName = tableInfo.getName();
        String unitPrefix = "vika_unit_";
        String prefix = "vika_";
        if (tableName.startsWith(unitPrefix)) {
            return NamingStrategy.capitalFirst(NamingStrategy.removePrefixAndCamel(tableName, Collections.singleton(unitPrefix)));
        }
        else {
            return NamingStrategy.capitalFirst(NamingStrategy.removePrefixAndCamel(tableName, Collections.singleton(prefix)));
        }
    }

    @Override
    public String propertyNameConvert(TableField field) {
        return NamingStrategy.underlineToCamel(field.getName());
    }
}
