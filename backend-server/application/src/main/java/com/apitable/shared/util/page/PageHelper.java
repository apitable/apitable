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

package com.apitable.shared.util.page;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.NumberUtil;
import cn.hutool.core.util.ReUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.apitable.base.enums.ParameterException;
import com.apitable.core.util.ExceptionUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.metadata.OrderItem;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import java.util.ArrayList;
import java.util.List;

/**
 * <p>
 * page helper util.
 * </p>
 *
 * @author Shawn Deng
 */
public class PageHelper {

    private static final String TOTAL = "total";

    private static final String PAGE_NO = "pageNo";

    private static final String PAGE_SIZE = "pageSize";

    private static final String ORDER = "order";

    private static final String SORT = "sort";

    private static final String ASC = "asc";

    /**
     * convert string to page.
     *
     * @param stringObjectParams string params
     * @param <T>                type
     * @return page
     */
    public static <T> Page<T> convert(String stringObjectParams) {
        ExceptionUtil.isTrue(JSONUtil.isTypeJSONObject(stringObjectParams),
            ParameterException.INCORRECT_ARG);
        JSONObject json = JSONUtil.parseObj(stringObjectParams);

        int pageNo = 1;
        int pageSize = 20;

        String pageSizeParam = json.getStr(PAGE_SIZE);

        if (StrUtil.isNotEmpty(pageSizeParam) && NumberUtil.isNumber(pageSizeParam)) {
            pageSize = NumberUtil.parseInt(pageSizeParam);
        }

        String pageNoParam = json.getStr(PAGE_NO);

        if (StrUtil.isNotEmpty(pageNoParam) && NumberUtil.isNumber(pageNoParam)) {
            pageNo = NumberUtil.parseInt(pageNoParam);
        }

        Page<T> page = new Page<>();

        page.setCurrent(pageNo);
        page.setSize(pageSize);

        String total = json.getStr(TOTAL);
        if (StrUtil.isNotEmpty(total) && NumberUtil.isNumber(total)) {
            page.setTotal(NumberUtil.parseInt(total));
        }

        String orderParam = json.getStr(ORDER);
        String sortParam = json.getStr(SORT);

        if (StrUtil.isNotEmpty(orderParam) && StrUtil.isNotEmpty(sortParam)) {

            String[] orders = orderParam.split(",");
            String[] sorts = sortParam.split(",");
            if (ArrayUtil.isNotEmpty(sorts) && ArrayUtil.isNotEmpty(orders)) {
                List<OrderItem> orderItems = new ArrayList<>();
                String createTime = "createTime";
                String updateTime = "updateTime";
                for (int i = 0; i < sorts.length; i++) {
                    String order = orders[i];
                    ExceptionUtil.isTrue(ReUtil.isMatch("^[a-zA-Z_.]*$", order.trim()),
                        ParameterException.INCORRECT_ARG);
                    if (createTime.equals(order)) {
                        order = "createdAt";
                    }
                    if (updateTime.equals(order)) {
                        order = "updatedAt";
                    }
                    if (ASC.equalsIgnoreCase(sorts[i])) {
                        orderItems.add(OrderItem.asc(StrUtil.toUnderlineCase(order)));
                    } else {
                        orderItems.add(OrderItem.desc(StrUtil.toUnderlineCase(order)));
                    }
                }
                page.addOrder(orderItems);
            }
        }

        return page;
    }

    public static <T> PageInfo<T> build(IPage<T> page) {
        return new PageInfo<>(page.getCurrent(), page.getSize(), page.getTotal(),
            page.getRecords());
    }

    public static <T> PageInfo<T> build(long pageNum, long pageSize, long total, List<T> records) {
        return new PageInfo<>(pageNum, pageSize, total, records);
    }
}
