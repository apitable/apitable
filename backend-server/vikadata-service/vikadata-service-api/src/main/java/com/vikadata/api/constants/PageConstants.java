package com.vikadata.api.constants;

/**
 * <p>
 * 分页变量
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/5 10:59
 */
public class PageConstants {

    /**
     * 统一请求分页参数名称
     */
    public static final String PAGE_PARAM = "pageObjectParams";

    /**
     * 分页简单示例
     */
    public static final String PAGE_SIMPLE_EXAMPLE = "{\"pageNo\":1,\"pageSize\":20}";

    /**
     * 分页复杂示例
     */
    public static final String PAGE_COMPLEX_EXAMPLE = "{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}";

    /**
     * 分页请求说明
     */
    public static final String PAGE_DESC = "分页对象参数说明: <br/> " +
            "pageNo: 页码。<br/>" +
            "pageSize: 页大小。<br/>" +
            "order: 排序的字段,字段来与结果集存在的字段，传递不存在的字段将出现异常，逗号分隔开，可以不传递。<br/>" +
            "sort: 排序规则,只能asc或desc，逗号分隔开，与order的索引同步。<br/>" +
            "简单示例：" + PAGE_SIMPLE_EXAMPLE + "<br/>" +
            "复杂示例：" + PAGE_COMPLEX_EXAMPLE;
}
