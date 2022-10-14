package com.vikadata.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.baomidou.mybatisplus.annotation.FieldFill;
import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableField;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableLogic;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.experimental.Accessors;

/**
 * <p>
 * Template Center - Template Album Table
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
@TableName("vika_template_album")
public class TemplateAlbumEntity implements Serializable {

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
     * I18n Key Name
     */
    private String i18nName;

    /**
     * Template Album Name
     */
    private String name;

    /**
     * Template Album Cover Token(The Relative Path of Asset)
     */
    private String cover;

    /**
     * Template Album Description
     */
    private String description;

    /**
     * Template Album Content
     */
    private String content;

    /**
     * Author Name
     */
    private String authorName;

    /**
     * Author Logo Token(The Relative Path of Asset)
     */
    private String authorLogo;

    /**
     * Author Description
     */
    private String authorDesc;

    /**
     * Delete Marker(0: no, 1: yes)
     */
    @TableLogic
    private Integer isDeleted;

    /**
     * Creator User ID
     */
    @TableField(fill = FieldFill.INSERT)
    private Long createdBy;

    /**
     * Last Modified User ID
     */
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private Long updatedBy;

    /**
     * Creation Time
     */
    private LocalDateTime createdAt;

    /**
     * Modified Time
     */
    private LocalDateTime updatedAt;

}
