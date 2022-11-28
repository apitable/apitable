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
 * 第三方系统-微信关键词消息自动回复表
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
@TableName(keepGlobalPrefix = true, value = "wechat_keyword_reply")
public class WechatKeywordReplyEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 公众号Appid（关联#vika_wechat_authorization#authorizer_appid）
     */
    private String appId;

    /**
     * 规则名称
     */
    private String ruleName;

    /**
     * 关键词匹配模式，contain代表消息中含有该关键词即可，equal表示消息内容必须和关键词严格相同
     */
    private String matchMode;

    /**
     * 回复模式，reply_all代表全部回复，random_one代表随机回复其中一条 
     */
    private String replyMode;

    /**
     * 关键词，对于文本类型，content是文本内容，对于图文、图片、语音、视频类型，content是mediaID
     */
    private String keyword;

    /**
     * 回复内容，对于文本类型，content是文本内容，对于图文、图片、语音、视频类型，content是mediaID
     */
    private String content;

    /**
     * 自动回复的类型，关注后自动回复和消息自动回复的类型仅支持文本（text）、图片（img）、语音（voice）、视频（video），关键词自动回复则还多了图文消息（news）
     */
    private String type;

    /**
     * 图文消息的回复内容
     */
    private String newsInfo;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;

}
