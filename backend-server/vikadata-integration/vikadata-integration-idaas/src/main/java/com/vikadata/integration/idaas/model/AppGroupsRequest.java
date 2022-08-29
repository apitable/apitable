package com.vikadata.integration.idaas.model;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 获取应用下的用户组雷彪
 * </p>
 * @author 刘斌华
 * @date 2022-06-14 17:00:03
 */
@Setter
@Getter
public class AppGroupsRequest {

    /**
     * 起始页码。从 0 开始
     */
    @JsonProperty("page_index")
    private Integer pageIndex;

    /**
     * 分页大小
     */
    @JsonProperty("page_size")
    private Integer pageSize;

    /**
     * 排序字段，前面带 {@code _} 表示升序，否则降序
     */
    @JsonProperty("order_by")
    private List<String> orderBy;

    /**
     * 应用类型
     */
    @JsonProperty("app_instance_type")
    private String appInstanceType = "SSO";

}
