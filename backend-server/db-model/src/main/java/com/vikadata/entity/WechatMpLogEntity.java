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
 * 第三方系统-微信公众号日志表
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
@TableName(keepGlobalPrefix = true, value = "wechat_mp_log")
public class WechatMpLogEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 应用 appid
     */
    private String appId;

    /**
     * 开放应用内的唯一标识
     */
    private String openId;

    /**
     * 开发者企业内的唯一标识
     */
    private String unionId;

    /**
     * 消息类型
     */
    private String msgType;

    /**
     * 事件类型
     */
    private String eventType;

    /**
     * 场景值
     */
    private String scene;

    /**
     * 其他信息
     */
    private String extra;

    /**
     * [冗余]创建者名称
     */
    private String creatorName;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

}
