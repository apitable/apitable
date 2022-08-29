package com.vikadata.scheduler.space.handler;

import javax.annotation.Resource;

import com.xxl.job.core.context.XxlJobHelper;
import com.xxl.job.core.handler.annotation.XxlJob;

import com.vikadata.scheduler.space.service.IDataProcessService;

import org.springframework.stereotype.Component;

/**
 * <p>
 * 数据清洗任务处理器
 * </p>
 *
 * @author Chambers
 * @date 2021/5/26
 */
@Component
public class DataProcessJobHandler {

    @Resource
    private IDataProcessService iDataProcessService;

    @XxlJob(value = "ControlInitJobHandler")
    public void controlDataInit() {
        String params = XxlJobHelper.getJobParam();
        XxlJobHelper.log("node control 数据初始化. param:{}", params);
        iDataProcessService.controlDataInit();
    }

    @XxlJob(value = "ControlCompensateJobHandler")
    public void controlCompensate() {
        String params = XxlJobHelper.getJobParam();
        XxlJobHelper.log("node control 数据补充. param:{}", params);
        iDataProcessService.controlCompensate();
    }
}
