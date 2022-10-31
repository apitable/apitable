package com.vikadata.social.wecom.model;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamConverter;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.common.util.XmlUtils;
import me.chanjar.weixin.common.util.xml.XStreamCDataConverter;
import me.chanjar.weixin.cp.bean.message.WxCpTpXmlMessage;

/**
 * Enterprise and micro service provider messages notify the decrypted content, adding information such as orders
 */
@Setter
@Getter
@EqualsAndHashCode(callSuper = false)
@XStreamAlias("xml")
public class WxCpIsvXmlMessage extends WxCpTpXmlMessage {

    @XStreamAlias("PaidCorpId")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String paidCorpId;

    @XStreamAlias("OrderId")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String orderId;

    @XStreamAlias("OperatorId")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String operatorId;

    @XStreamAlias("OldOrderId")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String oldOrderId;

    @XStreamAlias("NewOrderId")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String newOrderId;

    public static WxCpIsvXmlMessage fromXml(String xml) {

        WxCpIsvXmlMessage xmlMessage = WxCpIsvXmlMessageStreamTransformer.fromXml(xml);
        xmlMessage.setAllFieldsMap(XmlUtils.xml2Map(xml));

        return xmlMessage;

    }

}
