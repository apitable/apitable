package com.vikadata.scheduler.space.handler;

import javax.annotation.Resource;

import cn.hutool.json.JSONUtil;
import com.xxl.job.core.context.XxlJobHelper;
import com.xxl.job.core.handler.annotation.XxlJob;
import lombok.Getter;
import lombok.Setter;

import com.vikadata.scheduler.space.service.IDatasheetMetaService;

import org.springframework.stereotype.Component;

/**
 * <p>
 * 修复数表数据相关Handler
 * </p>
 *
 * @author Pengap
 * @date 2022/4/14 15:08:47
 */
@Component
public class FixDatasheetDataHandler {

    @Resource
    private IDatasheetMetaService iDatasheetMetaService;

    @XxlJob(value = "fixDatasheetData")
    public void execute() {
        String param = XxlJobHelper.getJobParam();
        XxlJobHelper.log("Job. param:{}", param);
        JobParam jobParam = JSONUtil.toBean(param, JobParam.class);

        switch (jobParam.getFixDataMode()) {
            case FIX_TEMPLATE_VIEW_SORTINFO:
                iDatasheetMetaService.fixTemplateViewSortInfo(jobParam);
                break;
            default:
                XxlJobHelper.log("Fix Data Mode Undefined");
                break;
        }
    }

    @Getter
    @Setter
    public static class JobParam {
        enum FixDataMode {
            // 修复数表视图排序字段
            FIX_TEMPLATE_VIEW_SORTINFO
        }

        private FixDataMode fixDataMode;

        private String spaceId;

        private String dstId;
    }

}
