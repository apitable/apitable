package com.vikadata.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * Template Center - Template Album Relation Table
 * </p>
 *
 * @author Mybatis Generator Tool
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@EqualsAndHashCode
@TableName(keepGlobalPrefix = true, value = "template_album_rel")
public class TemplateAlbumRelEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary Key
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * Template Album Custom ID
     */
    private String albumId;

    /**
     * Relate Type(0: template category, 1: template, 2: template tag)
     */
    private Integer type;

    /**
     * Relate Object Custom ID(0: category_code, 1: temlate_id, 2: tag_code)
     */
    private String relateId;

    /**
     * Creation Time
     */
    private LocalDateTime createdAt;

}
