package com.vikadata.social.service.dingtalk.entity;

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
 * 3rd party platform integration - high priority push data sheet
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@EqualsAndHashCode
@TableName("vika_ding_talk_open_sync_biz_data")
public class DingTalkOpenSyncBizDataEntity implements Serializable {

    private static final long serialVersionUID = -8900015203702889446L;

    /**
     * primary key
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * suite suiteid underlined 0
     */
    private String subscribeId;

    /**
     * corporate corpid
     */
    private String corpId;

    private Integer bizType;

    /**
     * category id
     */
    private String bizId;

    /**
     * Category data
     */
    private String bizData;

    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;
}
