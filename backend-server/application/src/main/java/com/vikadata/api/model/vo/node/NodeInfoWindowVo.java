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
 * Node information window vo
 * </p>
 */
@Data
@Builder(toBuilder = true)
public class NodeInfoWindowVo {

    /**
     * Node ID
     * */
    private String nodeId;

    /**
     * Node Name
     * */
    private String nodeName;

    /**
     * Node Type
     * */
    private Integer nodeType;

    /**
     * Node icon
     * */
    private String icon;

    /**
     * Created by
     * */
    private MemberInfo creator;

    /**
     * Recently modified by
     * */
    private MemberInfo lastModifier;

    @Data
    @Builder(toBuilder = true)
    public static class MemberInfo {

        /**
         * Member Name
         * */
        private String memberName;

        /**
         * Member avatar
         * */
        @JsonSerialize(nullsUsing = NullStringSerializer.class, using = ImageSerializer.class)
        private String avatar;

        /**
         * Time stamp
         * */
        private LocalDateTime time;

        /**
         * Whether the member is activated
         * */
        private Boolean isActive;

        /**
         * Delete member
         * */
        @JsonSerialize(nullsUsing = NullBooleanSerializer.class)
        private Boolean isDeleted;
    }
}
