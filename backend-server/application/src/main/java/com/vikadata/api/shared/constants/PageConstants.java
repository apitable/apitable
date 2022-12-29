package com.vikadata.api.shared.constants;

/**
 * <p>
 * paging constants
 * </p>
 *
 * @author Shawn Deng
 */
public class PageConstants {

    /**
     * page request parameter
     */
    public static final String PAGE_PARAM = "pageObjectParams";

    /**
     * page request example description
     */
    public static final String PAGE_SIMPLE_EXAMPLE = "{\"pageNo\":1,\"pageSize\":20}";

    /**
     * page complex request example description
     */
    public static final String PAGE_COMPLEX_EXAMPLE = "{\"pageNo\":1,\"pageSize\":20,\"order\":\"createTime,updateTime\",\"sort\":\"asc,desc\"}";

    /**
     * page request usage description
     */
    public static final String PAGE_DESC = "Description of Paging: <br/> " +
            "pageNo: number of paging <br/>" +
            "pageSize: size of paging。<br/>" +
            "order: order in current page。<br/>" +
            "sort: sorting in current page。<br/>" +
            "simple usage example：" + PAGE_SIMPLE_EXAMPLE + "<br/>" +
            "complex usage example：" + PAGE_COMPLEX_EXAMPLE;
}
