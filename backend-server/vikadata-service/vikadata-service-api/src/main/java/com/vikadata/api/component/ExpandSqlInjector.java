package com.vikadata.api.component;

import java.util.List;

import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.core.injector.AbstractMethod;
import com.baomidou.mybatisplus.core.injector.DefaultSqlInjector;
import com.baomidou.mybatisplus.core.metadata.TableInfo;
import com.baomidou.mybatisplus.extension.injector.methods.InsertBatchSomeColumn;

/**
 * 拓展mybatisPlus 支持批量插入
 *
 * @author Zoe Zheng
 * @date 2021-11-08 19:53:38
 */
public class ExpandSqlInjector extends DefaultSqlInjector {

    @Override
    public List<AbstractMethod> getMethodList(Class<?> mapperClass, TableInfo tableInfo) {
        List<AbstractMethod> methodList = super.getMethodList(mapperClass, tableInfo);
        InsertBatchSomeColumn insertBatchSomeColumn = new InsertBatchSomeColumn(t -> !StrUtil.equalsAny(t.getProperty(), "createdAt", "updatedAt", "isDeleted"));
        methodList.add(insertBatchSomeColumn);
        return methodList;
    }
}
