package com.vikadata.api.helper;

import java.util.ArrayList;
import java.util.List;

import cn.hutool.core.util.ArrayUtil;
import cn.hutool.core.util.NumberUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.core.metadata.OrderItem;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;

import com.vikadata.api.lang.PageInfo;

/**
 * <p>
 * 分页 帮助类
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/11/22 18:24
 */
public class PageHelper {

    private static final String TOTAL = "total";

    private static final String PAGE_NO = "pageNo";

    private static final String PAGE_SIZE = "pageSize";

    private static final String ORDER = "order";

    private static final String SORT = "sort";

    private static final String ASC = "asc";


    public static <T> Page<T> convert(String stringObjectParams) {

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

    /**
     * 对Page<T>封装
     */
    public static <T> PageInfo<T> build(IPage<T> page) {
        return new PageInfo<>((int) page.getCurrent(), (int) page.getSize(), (int) page.getTotal(), page.getRecords());
    }

    /**
     * 构造通用分页对象
     */
    public static <T> PageInfo<T> build(int pageNum, int pageSize, int total, List<T> records) {
        return new PageInfo<>(pageNum, pageSize, total, records);
    }
}
