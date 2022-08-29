package com.vikadata.scheduler.space.handler;

import javax.annotation.Resource;

import com.xxl.job.core.biz.model.ReturnT;
import com.xxl.job.core.context.XxlJobHelper;
import com.xxl.job.core.handler.annotation.XxlJob;

import com.vikadata.integration.vika.VikaOperations;
import com.vikadata.scheduler.space.cache.service.RedisService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * <p>
 * 资源锁任务处理器
 * </p>
 *
 * @author Chambers
 * @date 2021/11/16
 */
@Component
public class ResourceLockJobHandler {

    @Resource
    private RedisService redisService;

    @Autowired(required = false)
    private VikaOperations vikaOperations;

    @XxlJob(value = "DelResourceLockJobHandler")
    public ReturnT<String> delResourceLock() {
        String param = XxlJobHelper.getJobParam();
        String result = redisService.delResourceLock();
        // 存在死锁，打印日志，发送到维格表保存记录
        if (result != null && !result.isEmpty()) {
            XxlJobHelper.log(result);
            vikaOperations.saveStatisticsData(param, result);
        }
        return ReturnT.SUCCESS;
    }
}
