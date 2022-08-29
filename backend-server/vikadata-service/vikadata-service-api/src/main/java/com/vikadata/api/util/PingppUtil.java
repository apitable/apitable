package com.vikadata.api.util;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.NoSuchAlgorithmException;
import java.security.PublicKey;
import java.security.Signature;
import java.security.SignatureException;
import java.util.Collections;
import java.util.HashMap;
import java.util.Map;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.pingplusplus.exception.PingppException;
import com.pingplusplus.model.Charge;
import com.pingplusplus.model.Event;
import com.pingplusplus.model.Webhooks;
import org.apache.commons.codec.binary.Base64;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.vikadata.api.enums.finance.PayChannel;
import com.vikadata.api.modular.finance.model.PingChargeSuccess;
import com.vikadata.api.util.pingpp.PingPublicKeyLoader;
import com.vikadata.core.exception.BusinessException;
import com.vikadata.core.util.HttpContextUtil;
import com.vikadata.system.config.billing.Price;

import static com.vikadata.api.enums.exception.OrderException.PAY_ORDER_FAIL;
import static com.vikadata.api.enums.finance.PayChannel.ALIPAY_PC;
import static com.vikadata.api.enums.finance.PayChannel.WX_PUB_QR;

/**
 * Ping++工具
 * @author Shawn Deng
 * @date 2022-05-16 09:51:53
 */
public class PingppUtil {

    private static final Logger log = LoggerFactory.getLogger(PingppUtil.class);

    public static final String PINGPP_SIGNATURE = "x-pingplusplus-signature";

    public static final String CHARGE_SUCCESS = "charge.succeeded";

    private static final ObjectMapper MAPPER = new ObjectMapper();

    static {
        MAPPER.setPropertyNamingStrategy(PropertyNamingStrategies.SNAKE_CASE);
        MAPPER.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
    }

    /**
     * get event data from request
     * @param requestBody 请求体
     * @param signature 签名
     * @return Event Object
     * @throws Exception exception
     */
    public static Event getEventFromRequest(String requestBody, String signature) throws Exception {

        boolean verify = verifyData(requestBody, signature, PingPublicKeyLoader.getPublicKey());
        if (!verify) {
            throw new RuntimeException("illegal pay callback request");
        }
        return Webhooks.eventParse(requestBody);
    }

    /**
     * 验证签名
     * @param dataString 请求数据
     * @param signatureString 签名
     * @param publicKey Ping++公钥
     * @return true | false
     * @throws NoSuchAlgorithmException 算法异常
     * @throws InvalidKeyException 无法校验异常
     * @throws SignatureException 签名异常
     */
    public static boolean verifyData(String dataString, String signatureString, PublicKey publicKey)
            throws NoSuchAlgorithmException, InvalidKeyException, SignatureException {
        byte[] signatureBytes = Base64.decodeBase64(signatureString);
        Signature signature = Signature.getInstance("SHA256withRSA");
        signature.initVerify(publicKey);
        signature.update(dataString.getBytes(StandardCharsets.UTF_8));
        return signature.verify(signatureBytes);
    }

    public static PingChargeSuccess parsePingChargeSuccessData(String eventData) {
        try {
            return MAPPER.readValue(eventData, new TypeReference<PingChargeSuccess>() {});
        }
        catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public static Charge createCharge(String appId, Price price, PayChannel channel, String outOrderNo, int amount) {
        // 创建支付流水号
        Map<String, Object> chargeParams = new HashMap<>();
        chargeParams.put("order_no", outOrderNo);
        chargeParams.put("amount", amount);
        chargeParams.put("app", Collections.singletonMap("id", appId));
        chargeParams.put("channel", channel.getName());
        chargeParams.put("currency", "cny");
        chargeParams.put("client_ip", HttpContextUtil.getRemoteAddr(HttpContextUtil.getRequest()));
        chargeParams.put("subject", price.getGoodChTitle());
        chargeParams.put("body", price.getGoodChTitle());
        Map<String, Object> extra = new HashMap<>();
        if (channel == WX_PUB_QR) {
            extra.put("product_id", price.getProduct());
        }
        else if (channel == ALIPAY_PC) {
            extra.put("qr_pay_mode", 4);
            extra.put("qrcode_width", 208);
        }
        chargeParams.put("extra", extra);
        try {
            //发起交易请求
            return Charge.create(chargeParams);
        }
        catch (PingppException e) {
            log.error("发起订单支付失败", e);
            throw new BusinessException(PAY_ORDER_FAIL);
        }
    }
}
