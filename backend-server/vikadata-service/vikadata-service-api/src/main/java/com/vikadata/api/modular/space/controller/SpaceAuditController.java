package com.vikadata.api.modular.space.controller;

import java.time.LocalDateTime;
import java.util.List;

import javax.annotation.Resource;
import javax.validation.Valid;
import javax.validation.constraints.Max;
import javax.validation.constraints.Min;

import io.swagger.annotations.Api;
import io.swagger.annotations.ApiImplicitParam;
import io.swagger.annotations.ApiImplicitParams;
import io.swagger.annotations.ApiOperation;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.context.LoginContext;
import com.vikadata.api.lang.PageInfo;
import com.vikadata.api.modular.space.model.SpaceAuditPageParam;
import com.vikadata.api.modular.space.model.vo.SpaceAuditPageVO;
import com.vikadata.api.modular.space.service.ISpaceAuditService;
import com.vikadata.core.support.ResponseData;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.constants.DateFormatConstants.TIME_SIMPLE_PATTERN;

/**
 * <p>
 * 空间审计接口
 * </p>
 *
 * @author Chambers
 * @date 2022/5/19
 */
@RestController
@ApiResource(path = "/space")
@Api(tags = "空间管理_空间审计相关接口")
public class SpaceAuditController {

    @Resource
    private ISpaceAuditService iSpaceAuditService;

    @GetResource(path = "/{spaceId}/audit", requiredPermission = false)
    @ApiOperation(value = "分页查询空间审计日志")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "spaceId", value = "空间ID", required = true, dataTypeClass = String.class, paramType = "path", example = "spc8mXUeiXyVo"),
            @ApiImplicitParam(name = "beginTime", value = "开始时间（格式：yyyy-MM-dd HH:mm:ss）", dataTypeClass = LocalDateTime.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "endTime", value = "结束时间（格式：yyyy-MM-dd HH:mm:ss）", dataTypeClass = LocalDateTime.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "memberIds", value = "成员ID列表", dataTypeClass = String.class, paramType = "query", example = "1,3,5"),
            @ApiImplicitParam(name = "actions", value = "动作类型列表", dataTypeClass = String.class, paramType = "query", example = "create_node,rename_node"),
            @ApiImplicitParam(name = "keyword", value = "搜索关键词", dataTypeClass = String.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "pageNo", value = "页码（默认为1）", dataTypeClass = Integer.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "pageSize", value = "页大小（默认为20，最大值100）", dataTypeClass = Integer.class, paramType = "query", example = "20"),
    })
    public ResponseData<PageInfo<SpaceAuditPageVO>> audit(@PathVariable("spaceId") String spaceId,
            @RequestParam(name = "beginTime", required = false) @DateTimeFormat(pattern = TIME_SIMPLE_PATTERN) LocalDateTime beginTime,
            @RequestParam(name = "endTime", required = false) @DateTimeFormat(pattern = TIME_SIMPLE_PATTERN) LocalDateTime endTime,
            @RequestParam(name = "memberIds", required = false) List<Long> memberIds,
            @RequestParam(name = "actions", required = false) List<String> actions,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(value = "pageNo", defaultValue = "1") @Valid @Min(1) Integer pageNo,
            @RequestParam(value = "pageSize", defaultValue = "20") @Valid @Min(5) @Max(100) Integer pageSize) {
        // 校验是否跨空间
        LoginContext.me().getUserSpaceDto(spaceId);
        // 获取空间审计分页信息
        SpaceAuditPageParam param = SpaceAuditPageParam.builder()
                .beginTime(beginTime)
                .endTime(endTime)
                .memberIds(memberIds)
                .actions(actions)
                .keyword(keyword)
                .pageNo(pageNo)
                .pageSize(pageSize)
                .build();
        return ResponseData.success(iSpaceAuditService.getSpaceAuditPageVO(spaceId, param));
    }
}
