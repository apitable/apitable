package com.vikadata.scheduler.bill.handler;

import cn.hutool.core.util.StrUtil;
import cn.hutool.http.HttpRequest;
import cn.hutool.http.HttpResponse;
import cn.hutool.http.HttpUtil;
import cn.hutool.json.JSONObject;
import cn.hutool.json.JSONUtil;
import com.xxl.job.core.context.XxlJobHelper;
import com.xxl.job.core.handler.annotation.XxlJob;

import com.vikadata.integration.vika.VikaOperations;
import com.vikadata.integration.vika.model.OriginalWhite;
import com.vikadata.integration.vika.model.UserOrder;
import com.vikadata.scheduler.bill.request.CreateSubscriptionRequest;
import com.vikadata.scheduler.bill.response.ResponseMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 白名单处理
 *
 * @author Shawn Deng
 * @date 2021-12-27 21:52:20
 */
@Component
public class WhiteListHandler {

    @Autowired(required = false)
    private VikaOperations vikaOperations;

    @XxlJob("syncWhiteList")
    public void syncWhiteList() {
        String params = XxlJobHelper.getJobParam();
        String host;
        String token;
        String dstId;
        if (StrUtil.isBlank(params)) {
            host = "https://vika.cn";
            token = "uskkpOaoA8rVQ5uVuCYMSky";
            dstId = "dstK19iRDHJXbcdGH2";
        }
        else {
            if (!JSONUtil.isJsonObj(params)) {
                XxlJobHelper.handleFail("非法参数结构");
                return;
            }
            JSONObject jsonObject = JSONUtil.parseObj(params);
            if (!jsonObject.containsKey("host")) {
                XxlJobHelper.handleFail("host 参数不存在");
                return;
            }
            host = jsonObject.getStr("host");
            if (!jsonObject.containsKey("token")) {
                XxlJobHelper.handleFail("token 参数不存在");
                return;
            }
            token = jsonObject.getStr("token");
            if (!jsonObject.containsKey("dstId")) {
                XxlJobHelper.handleFail("dstId 参数不存在");
                return;
            }
            dstId = jsonObject.getStr("dstId");
        }

        OriginalWhite originalWhite = vikaOperations.fetchRecordOnWhiteList(host, token, dstId);
        if (originalWhite == null) {
            XxlJobHelper.handleSuccess("没查询到，无需处理");
            return;
        }
        XxlJobHelper.log(JSONUtil.toJsonPrettyStr(originalWhite));
        // 判断是否满足条件
        if (StrUtil.isBlank(originalWhite.getBillingProduct())) {
            XxlJobHelper.handleSuccess("订单条件不满足，丢弃掉本次处理");
            vikaOperations.updateWhiteMigrateStatus(host, token, dstId, originalWhite.getRecordId(), "无法处理");
            return;
        }
        vikaOperations.addRecordToBillingSheet(originalWhite);
        vikaOperations.updateWhiteMigrateStatus(host, token, dstId, originalWhite.getRecordId(), "已处理");
    }

    @XxlJob("newOrderHandler")
    public void newOrderHandler() {
        UserOrder userOrder = vikaOperations.fetchOrderData();
        if (userOrder == null) {
            // 没有订单，不需要处理
            XxlJobHelper.handleSuccess("没有新订单，无需处理");
            return;
        }
        CreateSubscriptionRequest body = new CreateSubscriptionRequest();
        body.setSpaceId(userOrder.getSpaceId());
        body.setBasePlan(userOrder.getPlanName());
        body.setStartDate(userOrder.getStartDate());
        body.setMonths(userOrder.getMonths());
        HttpRequest request = HttpUtil.createPost("https://vika.cn/api/v1/gm/createSubscription")
                .bearerAuth("uskkpOaoA8rVQ5uVuCYMSky")
                .body(JSONUtil.toJsonStr(body));
        HttpResponse response = request.execute();
        if (!response.isOk()) {
            // 网络异常或者其他错误
            XxlJobHelper.handleFail("上线失败");
            vikaOperations.updateOrderHandleStatus(userOrder.getRecordId(), "上线失败", "无法请求订阅开通接口");
            return;
        }
        ResponseMessage responseMessage = JSONUtil.toBean(response.body(), ResponseMessage.class);
        if (!responseMessage.isSuccess()) {
            XxlJobHelper.log("上线失败: {}", responseMessage.getMessage());
            XxlJobHelper.handleFail(responseMessage.getMessage());
            vikaOperations.updateOrderHandleStatus(userOrder.getRecordId(), "上线失败", responseMessage.getMessage());
            return;
        }
        // 处理成功，修改处理状态
        vikaOperations.updateOrderHandleStatus(userOrder.getRecordId(), "已上线", responseMessage.getMessage());
    }
}
