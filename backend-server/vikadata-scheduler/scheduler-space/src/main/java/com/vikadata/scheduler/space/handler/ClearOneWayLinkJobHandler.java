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
 * Clear One Way Link Job Handler
 * </p>
 */
@Component
public class ClearOneWayLinkJobHandler {

    @Resource
    private IDatasheetMetaService iDatasheetMetaService;

    @XxlJob(value = "clearSingleAssociation")
    public void execute() {
        String param = XxlJobHelper.getJobParam();
        XxlJobHelper.log("Job. param:{}", param);
        JobParam jobParam = JSONUtil.toBean(param, JobParam.class);

        iDatasheetMetaService.oneWayLinkDataHandler(jobParam);
    }

    /**
     * Online full space station scan and repair is not supported for now,
     * * because the pressure on the database is a bit large,
     * * and it can only operate on designated space stations during online operation*
     */
    @Getter
    @Setter
    public static class JobParam {

        public enum RunFunc {
            // List one-way correlation exception data without any processing operation (default)
            LIST,
            // Clean up one-way associated data, clean up the data
            HANDLE,
            // Read the remote data stream and clean the data
            READ_REMOTE_STREAM,
        }

        // run model
        private RunFunc runFunc = RunFunc.LIST;

        private String spaceId;

        /*
         * remote stream Url(resource relative address)
         * example：
         * full URL：https://xxx.com/job/analyze/association/result/main-2022-02-24%2014%3A28%3A08.json
         * relative address: job/analyze/association/result/main-2022-02-24%2014%3A28%3A08.json
         */
        private String readRemoteStreamUrl;

        private int coreQueryPoolSize = 8;

        private int coreAnalyzePoolSize = 64;

        private long pageSize = 10000L;

        /**
         * execution interval
         * default:500ms
         */
        private long executionInterval = 500L;
    }

}
