package com.vikadata.integration.idaas.model;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

/**
 * <p>
 * 获取用户组列表
 * </p>
 * @author 刘斌华
 * @date 2022-05-13 17:34:26
 */
@Setter
@Getter
public class GroupsResponse {

    private Integer total;

    private List<GroupResponse> data;

    @Setter
    @Getter
    public static class GroupResponse {

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
