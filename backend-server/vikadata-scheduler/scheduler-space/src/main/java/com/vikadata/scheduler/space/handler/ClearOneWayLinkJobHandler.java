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
 * 清理数表单向关联数据
 * </p>
 * @author Pengap
 * @date 2022/1/19 18:52:03
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

    @Getter
    @Setter
    public static class JobParam {
        // 暂不支持线上全空间站扫描修复，因为对数据库压力有点大，线上运行时只能对指定空间站操作

        public enum RunFunc {
            // 列出单向关联异常数据，不做任何处理操作（默认）
            LIST,
            // 清理单向关联数据，对数据清理
            HANDLE,
            // 读取远程数据流，对数据清理
            READ_REMOTE_STREAM,
        }

        // 运行模式
        private RunFunc runFunc = RunFunc.LIST;

        // 空间站Id
        private String spaceId;

        /*
         * 远程流Url（七牛云相对地址）
         * 举个栗子：
         *  完整URL：https://s1.vika.ltd/job/analyze/association/result/main-2022-02-24%2014%3A28%3A08.json
         *  需用携带域名：https://s1.vika.ltd/，只用传入：job/analyze/association/result/main-2022-02-24%2014%3A28%3A08.json
         */
        private String readRemoteStreamUrl;

        private int coreQueryPoolSize = 8;

        private int coreAnalyzePoolSize = 64;

        private long pageSize = 10000L;

        // 执行间隔，默认500ms
        private long executionInterval = 500L;
    }

}
