package com.vikadata.scheduler.space.pojo;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ApiUsage {

    private Long id;

    private Long userId;

    private String spaceId;

    private String dstId;

    private String reqPath;

    private Integer reqMethod;

    private String apiVersion;

    private String reqIp;

    private String reqDetail;

    private String resDetail;

    private LocalDateTime createdAt;
}
