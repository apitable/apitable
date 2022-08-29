package com.vikadata.scheduler.space.handler;

import javax.annotation.Resource;

import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.xxl.job.core.context.XxlJobHelper;
import com.xxl.job.core.handler.annotation.XxlJob;

import com.vikadata.scheduler.space.service.IUserService;

import org.springframework.stereotype.Component;

@Component
public class UserJobHandler {

    /**
     * 冷静期默认天数为30天，超过该时长未撤销注销则关闭账号.
     */
    private final static Integer DEFAULT_PAUSE_LIMIT_DAYS = 30;

    private final static String PAUSE_LIMIT_DAYS_KEY_NAME = "PAUSE_LIMIT_DAYS";

    @Resource
    private IUserService userService;

    /**
     * 关闭冷静期账号
     */
    @XxlJob(value = "closePausedUserJobHandler")
    public void closePausedUserJobHandler() {
        String param = XxlJobHelper.getJobParam();
        XxlJobHelper.log("param:{}", param);
        int pausdLimitDays = getPauseLimitDays(param);
        userService.closePausedUser(pausdLimitDays);
    }

    /**
     * 清洗异常V币积分
     */
    @XxlJob(value = "integralCleanJobHandler")
    public void integralCleanJobHandler(){
        String param = XxlJobHelper.getJobParam();
        XxlJobHelper.log("param:{}", param);
        userService.integralClean();
    }

    private int getPauseLimitDays(String param) {
        if(StrUtil.isNotBlank(param)) {
            JSONObject obj = JSONUtil.parseObj(param);
            return obj.getInt(PAUSE_LIMIT_DAYS_KEY_NAME, DEFAULT_PAUSE_LIMIT_DAYS);
        }
        return DEFAULT_PAUSE_LIMIT_DAYS;
    }
}
