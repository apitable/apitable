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
 * 开放平台-api请求信息记录表
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
@TableName("vika_api_usage")
public class ApiUsageEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    @TableId(value = "id", type = IdType.ASSIGN_ID)
    private Long id;

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 空间ID(关联#vika_space#space_id)
     */
    private String spaceId;

    /**
     * 数表ID(关联#vika_datasheet#dst_id)
     */
    private String dstId;

    /**
     * api的path,域名后面的数据，不包括query数据
     */
    private String reqPath;

    /**
     * api请求方式1 get 2 post 3 patch 4 put
     */
    private Integer reqMethod;

    /**
     * api版本
     */
    private String apiVersion;

    /**
     * 客户端IP
     */
    private String reqIp;

    /**
     * api调用详细信息,包括ua,refer等信息
     */
    private String reqDetail;

    /**
     * api调用返回信息，包括code,message等
     */
    private String resDetail;

    /**
     * 创建时间
     */
    private LocalDateTime createdAt;

}
