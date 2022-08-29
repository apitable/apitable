package com.vikadata.api.model.vo.node;

import java.time.LocalDateTime;

import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import lombok.Builder;
import lombok.Data;

import com.vikadata.api.support.serializer.ImageSerializer;
import com.vikadata.api.support.serializer.NullBooleanSerializer;
import com.vikadata.api.support.serializer.NullStringSerializer;

/**
 * <p>
 * 节点信息窗vo
 * </p>
 *
 * @author 胡海平(Humphrey Hu)
 * @date 2022/1/20 09:10:32
 */
@Data
@Builder(toBuilder = true)
public class NodeInfoWindowVo {

    /**
     * 节点ID
     * */
    private String nodeId;

    /**
     * 节点名称
     * */
    private String nodeName;

    /**
     * 节点类型
     * */
    private Integer nodeType;

    /**
     * 节点icon
     * */
    private String icon;

    /**
     * 创建人
     * */
    private MemberInfo creator;

    /**
     * 最近修改人
     * */
    private MemberInfo lastModifier;

    @Data
    @Builder(toBuilder = true)
    public static class MemberInfo {

        /**
         * 成员名称
         * */
        private String memberName;

        /**
         * 成员头像
         * */
        @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
        private String avatar;

        /**
         * 时间戳
         * */
        private LocalDateTime time;

        /**
         * 成员是否激活
         * */
        private Boolean isActive;

        /**
         * 成员是否删除
         * */
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean isDeleted;
    }
}
