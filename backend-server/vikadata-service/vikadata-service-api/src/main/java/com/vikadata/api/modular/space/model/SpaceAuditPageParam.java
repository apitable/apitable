package com.vikadata.api.modular.space.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * <p>
 * 空间审计分页参数
 * </p>
 *
 * @author Chambers
 * @date 2022/6/8
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder(toBuilder = true)
public class SpaceAuditPageParam {

    private LocalDateTime beginTime;

    private LocalDateTime endTime;

    private List<Long> memberIds;

    private List<String> actions;

    private String keyword;

    private Integer pageNo;

    private Integer pageSize;
}
