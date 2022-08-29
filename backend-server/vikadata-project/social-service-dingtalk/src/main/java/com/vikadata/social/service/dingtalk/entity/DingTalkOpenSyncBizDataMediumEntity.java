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
 * <p> 
 * 第三方平台集成-中优先级推送数据表
 * </p> 
 * @author zoe zheng 
 * @date 2021/10/25 15:27
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

    /**
     * 主键
     */
    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 套件suiteid加下划线0
     */
    private String subscribeId;

    /**
     * 企业corpid
     */
    private String corpId;

    private Integer bizType;

    /**
     * 类目ID
     */
    private String bizId;

    /**
     * 类目数据
     */
    private String bizData;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

    /**
     * 更新时间
     */
    private LocalDateTime updatedAt;
}
