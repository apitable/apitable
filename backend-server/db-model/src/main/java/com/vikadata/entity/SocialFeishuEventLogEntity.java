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
 * 第三方平台集成-飞书事件日志表
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
@TableName("vika_social_feishu_event_log")
public class SocialFeishuEventLogEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 应用标识
     */
    private String appId;

    /**
     * 企业标识
     */
    private String tenantKey;

    /**
     * 事件唯一标识
     */
    private String uuid;

    /**
     * 事件发送的时间
     */
    private String ts;

    /**
     * 事件类型
     */
    private String type;

    /**
     * 事件内容
     */
    private String eventData;

    /**
     * 是否已处理(0:否,1:是)
     */
    private Boolean status;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

}
