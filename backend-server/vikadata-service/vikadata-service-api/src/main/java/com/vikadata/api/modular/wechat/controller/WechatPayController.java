package com.vikadata.api.modular.wechat.controller;

import javax.annotation.Resource;
import javax.servlet.http.HttpServletRequest;

import cn.hutool.core.util.RandomUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONObject;
import com.github.binarywang.wxpay.bean.notify.WxPayOrderNotifyResult;
import com.github.binarywang.wxpay.bean.order.WxPayNativeOrderResult;
import com.github.binarywang.wxpay.bean.request.WxPayUnifiedOrderRequest;
import com.github.binarywang.wxpay.bean.result.WxPayOrderQueryResult;
import com.github.binarywang.wxpay.constant.WxPayConstants;
import com.github.binarywang.wxpay.exception.WxPayException;
import com.github.binarywang.wxpay.service.WxPayService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.annotation.ApiResource;
import com.vikadata.api.annotation.GetResource;
import com.vikadata.api.annotation.PostResource;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.support.ResponseData;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

/**
 * <p>
 * 微信支付相关接口
 * </p>
 *
 * @author Benson Cheung
 * @date 2021/03/18 20:12
 */
@Api(tags = "微信模块_支付相关服务接口（ICP审核专用）")
@ApiResource(name = "微信支付接口库", path = "/wechat/pay")
@RestController
@Slf4j
@SuppressWarnings("all")
public class WechatPayController {

    @Autowired(required = false)
    private WxPayService wxPayService;

    @Resource
    private RedisTemplate redisTemplate;

    @PostResource(path = "/notify/order", name = "接收微信支付成功回调时间的接口", requiredLogin = false, requiredPermission = false)
    @ApiOperation(value = "用户微信支付成功后，回调通知", notes = "用户微信支付成功后，回调通知")
    public ResponseData parseOrderNotifyResult(@RequestBody String xmlData) throws WxPayException {
        if (wxPayService == null) {
            throw new BusinessException("未开启微信支付组件");
        }
        final WxPayOrderNotifyResult notifyResult = this.wxPayService.parseOrderNotifyResult(xmlData);
        WxPayOrderQueryResult result = wxPayService.queryOrder(null, notifyResult.getOutTradeNo());
        if (result != null && result.getResultCode().equals("SUCCESS")
            && result.getReturnCode().equals("SUCCESS")
            && result.getTradeState().equals("SUCCESS")) {
            //支付成功，支付单号写入redis
            String key = StrUtil.format("vikadata:wechat:pay:{}", result.getOutTradeNo());
            redisTemplate.opsForValue().set(key, result.getOutTradeNo());
            return ResponseData.success(result);
        }
        return null;
    }

    @PostResource(path = "/createWxPayQrCode/{productType}", name = "微信生成支付二维码", requiredLogin = false)
    @ApiOperation(value = "微信生成支付二维码", notes = "微信生成支付二维码")
    public ResponseData<JSONObject> createWxPayQrCode(HttpServletRequest request, @PathVariable String productType) throws WxPayException {
        if (wxPayService == null) {
            throw new BusinessException("未开启微信支付组件");
        }
        String outTradeNo = RandomUtil.randomNumbers(32);
        Integer totalFee = 1;
        String description = "维格云-SAAS企业版";
        String productName = "维格云-SAAS企业版";
        if (productType.equals("junior")) {
            description = description + "初级会员-（30人版本）/年";
            productName = productName + "初级会员-（30人版本）/年";
            totalFee = 2668800;
        }
        else if (productType.equals("senior")) {
            description = description + "高级会员-（100人版本）/年";
            productName = productName + "高级会员-（100人版本）/年";
            totalFee = 5328800;
        }
        WxPayNativeOrderResult result = this.wxPayService
            .createOrder(WxPayUnifiedOrderRequest.newBuilder()
                .body(description)
                .totalFee(totalFee)
                .productId(productName)
                .spbillCreateIp(request.getRemoteHost())
                .notifyUrl("http://duoweibiaoge.com/api/v1/wechat/pay/notify/order")
                .tradeType(WxPayConstants.TradeType.NATIVE)
                .outTradeNo(outTradeNo)
                .build());
        JSONObject order = new JSONObject();
        order.putOpt("productName", productName);
        order.putOpt("description", description);
        order.putOpt("totalFee", totalFee);
        order.putOpt("outTradeNo", outTradeNo);
        order.putOpt("codeUrl", result.getCodeUrl());
        return ResponseData.success(order);
    }

    @GetResource(path = "/validate/pay/{outTradeNo}", name = "检查订单是否支付成功", requiredLogin = false)
    @ApiOperation(value = "检查订单是否支付成功", notes = "检查订单是否支付成功")
    public ResponseData<Void> validatePay(@PathVariable String outTradeNo) throws WxPayException {
        String s = (String) redisTemplate.opsForValue().get("vikadata:wechat:pay:" + outTradeNo);
        if (s != null) {
            return ResponseData.success();
        }
        return ResponseData.error("订单尚未支付成功");
    }
}
