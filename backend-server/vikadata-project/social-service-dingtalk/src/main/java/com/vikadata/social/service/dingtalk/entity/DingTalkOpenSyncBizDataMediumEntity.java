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
 * DingTalk Platform Integration - Medium Priority Push Data Sheet
 */
@Data
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Accessors(chain = true)
@EqualsAndHashCode
@TableName("vika_ding_talk_open_sync_biz_data_medium")
public class DingTalkOpenSyncBizDataMediumEntity implements Serializable {

    private static final long serialVersionUID = 4716619980582777147L;

    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    private String subscribeId;

    private String corpId;

    private Integer bizType;

    private String bizId;

    private String bizData;

    private LocalDateTime createdAt;
    
    private LocalDateTime updatedAt;
}
