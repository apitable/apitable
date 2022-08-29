package com.vikadata.scheduler.bill.handler;

import java.time.LocalDateTime;

import javax.annotation.Resource;

import cn.hutool.core.lang.Validator;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONArray;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.xxl.job.core.context.XxlJobHelper;
import com.xxl.job.core.handler.annotation.XxlJob;

import com.vikadata.entity.UserEntity;
import com.vikadata.scheduler.bill.mapper.UserIntegralMapper;
import com.vikadata.scheduler.bill.service.UserIntegralService;

import org.springframework.stereotype.Component;

/**
 * <p>
 * 订阅任务列表
 * </p>
 *
 * @author Shawn Deng
 * @date 2020/9/14 19:54
 */
@Component
public class BillingHandler {

    @Resource
    private UserIntegralMapper userIntegralMapper;

    @Resource
    private UserIntegralService userIntegralService;

    @XxlJob(value = "triggerIntegral")
    public void manualTriggerIntegral() {
        String params = XxlJobHelper.getJobParam();
        XxlJobHelper.log("手动触发积分操作：{}, 参数:{}", LocalDateTime.now(), params);
        if (StrUtil.isBlank(params)) {
            XxlJobHelper.handleFail("参数不能为空");
            return;
        }
        if (!JSONUtil.isJsonArray(params)) {
            XxlJobHelper.handleFail("非法参数结构");
            return;
        }
        // 解析参数
        JSONArray jsonArray = JSONUtil.parseArray(params);
        // 遍历参数
        for (JSONObject jsonObject : jsonArray.jsonIter()) {
            // 用户手机号
            String phone = jsonObject.getStr("phone");
            if (StrUtil.isBlank(phone)) {
                XxlJobHelper.handleFail("手机号不能为空");
                return;
            }
            if (!Validator.isMobile(phone)) {
                XxlJobHelper.handleFail("手机号[" + phone + "]不正确");
                return;
            }
            UserEntity user = userIntegralMapper.selectByPhone(phone);
            if (user == null) {
                XxlJobHelper.handleFail(StrUtil.format("不存在此手机号的用户：{}", phone));
                return;
            }
            // 积分额度，正值是添加，负值是扣减，不能为0
            Integer credit = jsonObject.getInt("credit");
            if (credit == null) {
                XxlJobHelper.handleFail("积分值必须填写");
                return;
            }

            if (credit == 0) {
                XxlJobHelper.handleFail("积分值不能为0");
                return;
            }

            if (credit > 0) {
                // 赠送值
                userIntegralService.addIntegral(user.getId(), credit);
            }

            if (credit < 0) {
                // 调整值
                userIntegralService.reduceIntegral(user.getId(), -credit);
            }
        }
        XxlJobHelper.log("手动触发积分操作：{}", LocalDateTime.now());
    }

    @XxlJob(value = "activityIntegral")
    public void activityIntegral() {
        String params = XxlJobHelper.getJobParam();
        XxlJobHelper.log("手动触发活动新增积分操作：{}, 参数：{}", LocalDateTime.now(), params);
        if (StrUtil.isBlank(params)) {
            XxlJobHelper.handleFail("参数不能为空");
            return;
        }
        if (!JSONUtil.isJsonArray(params)) {
            XxlJobHelper.handleFail("非法参数结构");
            return;
        }
        userIntegralService.activityIntegral(params);
    }
}
