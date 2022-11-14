package com.vikadata.api.space.controller;

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

import com.vikadata.api.shared.component.scanner.annotation.ApiResource;
import com.vikadata.api.shared.component.scanner.annotation.GetResource;
import com.vikadata.api.shared.context.LoginContext;
import com.vikadata.api.shared.util.page.PageInfo;
import com.vikadata.api.space.model.SpaceAuditPageParam;
import com.vikadata.api.space.model.vo.SpaceAuditPageVO;
import com.vikadata.api.space.service.ISpaceAuditService;
import com.vikadata.core.support.ResponseData;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import static com.vikadata.api.shared.constants.DateFormatConstants.TIME_SIMPLE_PATTERN;

@RestController
@ApiResource(path = "/space")
@Api(tags = "Space - Audit Api")
public class SpaceAuditController {

    @Resource
    private ISpaceAuditService iSpaceAuditService;

    @GetResource(path = "/{spaceId}/audit", requiredPermission = false)
    @ApiOperation(value = "Query space audit logs in pages")
    @ApiImplicitParams({
            @ApiImplicitParam(name = "spaceId", value = "space id", required = true, dataTypeClass = String.class, paramType = "path", example = "spc8mXUeiXyVo"),
            @ApiImplicitParam(name = "beginTime", value = "beginTime（format：yyyy-MM-dd HH:mm:ss）", dataTypeClass = LocalDateTime.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "endTime", value = "endTime（format：yyyy-MM-dd HH:mm:ss）", dataTypeClass = LocalDateTime.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "memberIds", value = "member ids", dataTypeClass = String.class, paramType = "query", example = "1,3,5"),
            @ApiImplicitParam(name = "actions", value = "actions", dataTypeClass = String.class, paramType = "query", example = "create_node,rename_node"),
            @ApiImplicitParam(name = "keyword", value = "keyword", dataTypeClass = String.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "pageNo", value = "page no（default 1）", dataTypeClass = Integer.class, paramType = "query", example = "1"),
            @ApiImplicitParam(name = "pageSize", value = "page size（default 20，max 100）", dataTypeClass = Integer.class, paramType = "query", example = "20"),
    })
    public ResponseData<PageInfo<SpaceAuditPageVO>> audit(@PathVariable("spaceId") String spaceId,
            @RequestParam(name = "beginTime", required = false) @DateTimeFormat(pattern = TIME_SIMPLE_PATTERN) LocalDateTime beginTime,
            @RequestParam(name = "endTime", required = false) @DateTimeFormat(pattern = TIME_SIMPLE_PATTERN) LocalDateTime endTime,
            @RequestParam(name = "memberIds", required = false) List<Long> memberIds,
            @RequestParam(name = "actions", required = false) List<String> actions,
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(value = "pageNo", defaultValue = "1") @Valid @Min(1) Integer pageNo,
            @RequestParam(value = "pageSize", defaultValue = "20") @Valid @Min(5) @Max(100) Integer pageSize) {
        // check whether it is cross space
        LoginContext.me().getUserSpaceDto(spaceId);
        // get spatial audit paging information
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
