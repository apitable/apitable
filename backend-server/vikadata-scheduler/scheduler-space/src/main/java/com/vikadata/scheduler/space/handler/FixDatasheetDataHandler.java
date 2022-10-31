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
 * Fix Datasheet DataH andler
 * </p>
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
            // fix number table view sort field
            FIX_TEMPLATE_VIEW_SORTINFO
        }

        private FixDataMode fixDataMode;

        private String spaceId;

        private String dstId;
    }

}
