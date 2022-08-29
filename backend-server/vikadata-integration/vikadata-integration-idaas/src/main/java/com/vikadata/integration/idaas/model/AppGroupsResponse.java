package com.vikadata.integration.idaas.model;

import java.util.List;

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
public class AppGroupsResponse {

    private Integer total;

    private List<AppGroupResponse> data;

    @Setter
    @Getter
    public static class AppGroupResponse {

        private String id;

        private String name;

        private String type;

        /**
         * 用户组排序
         *
         * <p>
         * 注意：接口本身并没有返回排序值，这里是方便同步至维格表进行排序使用
         * </p>
         */
        private Integer order;

    }

}
