package com.vikadata.schema;

import java.time.OffsetDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * <p>
 * node visited history
 * </p>
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
@Document(collection = "vika_node_recently_browsed")
public class NodeRecentlyBrowsedSchema {

    @Id
    private String id;

    /**
     * space id (linked#vika_space#space_id)
     */
    @Indexed(name = "idx_space_id")
    private String spaceId;

    /**
     * node id array (linked#vika_node#node_id)
     */
    private List<String> nodeIds;

    /**
     * member ID(linked#vika_unit_member#id)
     */
    @Indexed(name = "idx_member_id")
    private Long memberId;

    /**
     * node type  (1:folder,2:datasheet)
     */
    private Integer nodeType;

    private boolean isDeleted;

    @CreatedDate
    private OffsetDateTime createdAt;

    @LastModifiedDate
    private OffsetDateTime updatedAt;

}