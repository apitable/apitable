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
 * 通讯录上传解析审计表
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
@TableName(keepGlobalPrefix = true, value = "audit_upload_parse_record")
public class AuditUploadParseRecordEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 空间ID(vika_space#space_id)
     */
    private String spaceId;

    /**
     * 文件保存相对路径
     */
    private String fileSaveUrl;

    /**
     * 文件行数
     */
    private Integer rowSize;

    /**
     * 解析成功的行数
     */
    private Integer successCount;

    /**
     * 解析失败的行数
     */
    private Integer errorCount;

    /**
     * 解析失败详细
     */
    private String errorMsg;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

}
