package com.vikadata.social.wecom.model;

import java.io.Serializable;
import java.util.List;

import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.annotations.XStreamConverter;
import com.thoughtworks.xstream.converters.basic.IntConverter;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.Setter;
import me.chanjar.weixin.common.util.xml.IntegerArrayConverter;
import me.chanjar.weixin.common.util.xml.StringArrayConverter;
import me.chanjar.weixin.common.util.xml.XStreamCDataConverter;
import me.chanjar.weixin.cp.bean.message.WxCpTpXmlMessage;
import me.chanjar.weixin.cp.bean.message.WxCpXmlMessage;

/**
 * Message decryption message relay, solve the problem that inheritance {@link WxCpTpXmlMessage} cannot be cast
 */
@Setter
@Getter
@EqualsAndHashCode(callSuper = false)
@XStreamAlias("xml")
public class WxCpIsvXmlMessageDto implements Serializable {

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

    // ======== The following is copied from WxCpTpXmlMessage

    @XStreamAlias("SuiteId")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String suiteId;

    @XStreamAlias("InfoType")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String infoType;

    @XStreamAlias("TimeStamp")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String timeStamp;

    @XStreamAlias("SuiteTicket")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String suiteTicket;

    @XStreamAlias("AuthCode")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String authCode;

    @XStreamAlias("AuthCorpId")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String authCorpId;

    @XStreamAlias("ChangeType")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String changeType;

    @XStreamAlias("UserID")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String userID;

    @XStreamAlias("Department")
    @XStreamConverter(value = IntegerArrayConverter.class)
    protected Integer[] department;

    @XStreamAlias("MainDepartment")
    @XStreamConverter(value = IntConverter.class)
    protected Integer mainDepartment;

    @XStreamAlias("IsLeaderInDept")
    @XStreamConverter(value = IntegerArrayConverter.class)
    protected Integer[] isLeaderInDept;

    @XStreamAlias("Mobile")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String mobile;

    @XStreamAlias("Position")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String position;

    @XStreamAlias("Gender")
    @XStreamConverter(value = IntConverter.class)
    protected Integer gender;

    @XStreamAlias("Email")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String email;

    @XStreamAlias("Status")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String status;

    @XStreamAlias("Avatar")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String avatar;

    @XStreamAlias("Alias")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String alias;

    @XStreamAlias("Telephone")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String telephone;

    @XStreamAlias("Id")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String id;

    @XStreamAlias("Name")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String name;

    @XStreamAlias("ParentId")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String parentId;

    @XStreamAlias("Order")
    @XStreamConverter(value = IntConverter.class)
    protected Integer order;

    @XStreamAlias("TagId")
    @XStreamConverter(value = IntConverter.class)
    protected Integer tagId;

    @XStreamAlias("AddUserItems")
    @XStreamConverter(value = StringArrayConverter.class)
    protected String[] addUserItems;

    @XStreamAlias("DelUserItems")
    @XStreamConverter(value = StringArrayConverter.class)
    protected String[] delUserItems;

    @XStreamAlias("AddPartyItems")
    @XStreamConverter(value = IntegerArrayConverter.class)
    protected Integer[] addPartyItems;

    @XStreamAlias("DelPartyItems")
    @XStreamConverter(value = IntegerArrayConverter.class)
    protected Integer[] delPartyItems;

    //ref: https://work.weixin.qq.com/api/doc/90001/90143/90585
    @XStreamAlias("ServiceCorpId")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String serviceCorpId;

    @XStreamAlias("RegisterCode")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String registerCode;

    @XStreamAlias("ContactSync")
    protected WxCpTpXmlMessage.ContactSync contactSync;

    @XStreamAlias("AuthUserInfo")
    protected WxCpTpXmlMessage.AuthUserInfo authUserInfo;

    @XStreamAlias("TemplateId")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String templateId;

    @XStreamAlias("CreateTime")
    protected Long createTime;

    @XStreamAlias("ToUserName")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String toUserName;

    @XStreamAlias("FromUserName")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String fromUserName;

    @XStreamAlias("MsgType")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String msgType;

    @XStreamAlias("Event")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String event;

    @XStreamAlias("BatchJob")
    protected WxCpTpXmlMessage.BatchJob batchJob;

    @XStreamAlias("ExternalUserID")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String externalUserID;

    @XStreamAlias("State")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String state;

    @XStreamAlias("Source")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String source;

    @XStreamAlias("FailReason")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String failReason;

    @XStreamAlias("ChatId")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String chatId;

    @XStreamAlias("UpdateDetail")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String updateDetail;

    @XStreamAlias("JoinScene")
    protected Integer joinScene;

    @XStreamAlias("QuitScene")
    protected Integer quitScene;

    @XStreamAlias("MemChangeCnt")
    protected Integer memChangeCnt;

    @XStreamAlias("TagType")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String tagType;

    @XStreamAlias("WelcomeCode")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String welcomeCode;

    @XStreamAlias("FromUser")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String fromUser;

    @XStreamAlias("Content")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String content;

    @XStreamAlias("MsgId")
    protected String msgId;

    @XStreamAlias("AgentID")
    protected String agentID;

    @XStreamAlias("PicUrl")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String picUrl;

    @XStreamAlias("MediaId")
    @XStreamConverter(value = XStreamCDataConverter.class)
    protected String mediaId;

    @XStreamAlias("Format")
    @XStreamConverter(value = XStreamCDataConverter.class)
    private String format;

    @XStreamAlias("ThumbMediaId")
    @XStreamConverter(value = XStreamCDataConverter.class)
    private String thumbMediaId;

    @XStreamAlias("Location_X")
    private Double locationX;

    @XStreamAlias("Location_Y")
    private Double locationY;

    @XStreamAlias("Scale")
    private Double scale;

    @XStreamAlias("Label")
    @XStreamConverter(value = XStreamCDataConverter.class)
    private String label;

    @XStreamAlias("Title")
    @XStreamConverter(value = XStreamCDataConverter.class)
    private String title;

    @XStreamAlias("Description")
    @XStreamConverter(value = XStreamCDataConverter.class)
    private String description;

    @XStreamAlias("Url")
    @XStreamConverter(value = XStreamCDataConverter.class)
    private String url;

    @XStreamAlias("EventKey")
    @XStreamConverter(value = XStreamCDataConverter.class)
    private String eventKey;

    @XStreamAlias("Latitude")
    private Double latitude;

    @XStreamAlias("Longitude")
    private Double longitude;

    @XStreamAlias("Precision")
    private Double precision;

    @XStreamAlias("AppType")
    @XStreamConverter(value = XStreamCDataConverter.class)
    private String appType;

    @XStreamAlias("ScanCodeInfo")
    private WxCpXmlMessage.ScanCodeInfo scanCodeInfo = new WxCpXmlMessage.ScanCodeInfo();

    @XStreamAlias("SendPicsInfo")
    private WxCpXmlMessage.SendPicsInfo sendPicsInfo = new WxCpXmlMessage.SendPicsInfo();

    @XStreamAlias("SendLocationInfo")
    private WxCpXmlMessage.SendLocationInfo sendLocationInfo = new WxCpXmlMessage.SendLocationInfo();

    @XStreamAlias("ApprovalInfo")
    private WxCpTpXmlMessage.ApprovalInfo approvalInfo = new WxCpTpXmlMessage.ApprovalInfo();

    @XStreamAlias("TaskId")
    @XStreamConverter(value = XStreamCDataConverter.class)
    private String taskId;

    @Data
    @XStreamAlias("ContactSync")
    public static class ContactSync implements Serializable {
        private static final long serialVersionUID = 6031833682211475786L;

        @XStreamAlias("AccessToken")
        @XStreamConverter(value = XStreamCDataConverter.class)
        protected String accessToken;

        @XStreamAlias("ExpiresIn")
        protected Integer expiresIn;
    }

    @Data
    @XStreamAlias("AuthUserInfo")
    public static class AuthUserInfo implements Serializable {
        @XStreamAlias("UserId")
        @XStreamConverter(value = XStreamCDataConverter.class)
        protected String userId;
    }

    @Data
    @XStreamAlias("BatchJob")
    public static class BatchJob implements Serializable {
        private static final long serialVersionUID = 6031833682211475786L;

        @XStreamAlias("JobId")
        @XStreamConverter(value = XStreamCDataConverter.class)
        protected String JobId;

        @XStreamAlias("JobType")
        @XStreamConverter(value = XStreamCDataConverter.class)
        protected String jobType;

        @XStreamAlias("ErrCode")
        @XStreamConverter(value = IntConverter.class)
        protected Integer errCode;

        @XStreamAlias("ErrMsg")
        @XStreamConverter(value = XStreamCDataConverter.class)
        protected String errMsg;
    }

    @Data
    @XStreamAlias("ApprovalInfo")
    public static class ApprovalInfo implements Serializable {
        private static final long serialVersionUID = 6031833682211475786L;

        @XStreamAlias("ThirdNo")
        protected Long thirdNo;

        @XStreamAlias("OpenSpName")
        protected String openSpName;

        @XStreamAlias("OpenTemplateId")
        protected Integer openTemplateId;

        @XStreamAlias("OpenSpStatus")
        protected Integer openSpStatus;

        @XStreamAlias("ApplyTime")
        protected Long applyTime;

        @XStreamAlias("ApplyUserName")
        protected String applyUserName;

        @XStreamAlias("ApplyUserId")
        protected Integer applyUserId;

        @XStreamAlias("ApplyUserParty")
        protected String applyUserParty;

        @XStreamAlias("ApplyUserImage")
        protected String applyUserImage;

        @XStreamAlias("ApprovalNodes")
        protected List<WxCpTpXmlMessage.ApprovalInfo.ApprovalNode> approvalNodes;

        @XStreamAlias("NotifyNodes")
        protected List<WxCpTpXmlMessage.ApprovalInfo.NotifyNode> notifyNodes;

        @XStreamAlias("approverstep")
        protected Integer approverstep;

        // Self-built and third-party application calls approval process engine, status notification
        // ref: https://work.weixin.qq.com/api/doc/90001/90143/90376 #approval Status Notification Events
        // 1. After the self-built third-party application calls the approval process engine to initiate the
        // application, when the approval status changes
        // 2. After the self-built third-party application calls the approval process engine to initiate the
        // application, in the "Approval" state, when any approver performs the approval operation
        @Data
        @XStreamAlias("ApprovalNode")
        public static class ApprovalNode implements Serializable {
            private static final long serialVersionUID = 6031833682211475786L;

            @XStreamAlias("NodeStatus")
            protected Integer nodeStatus;

            @XStreamAlias("NodeAttr")
            protected Integer nodeAttr;

            @XStreamAlias("NodeType")
            protected Integer nodeType;

            @XStreamAlias("Items")
            protected List<WxCpTpXmlMessage.ApprovalInfo.ApprovalNode.Item> items;

            @Data
            @XStreamAlias("Item")
            public static class Item implements Serializable {
                private static final long serialVersionUID = 6031833682211475786L;

                @XStreamAlias("ItemName")
                protected String itemName;

                @XStreamAlias("ItemUserId")
                protected Integer itemUserId;

                @XStreamAlias("ItemImage")
                protected String itemImage;

                @XStreamAlias("ItemStatus")
                protected Integer itemStatus;

                @XStreamAlias("ItemSpeech")
                protected String itemSpeech;

                @XStreamAlias("ItemOpTime")
                protected Long itemOpTime;
            }
        }

        @Data
        @XStreamAlias("NotifyNode")
        public static class NotifyNode implements Serializable {
            private static final long serialVersionUID = 6031833682211475786L;

            @XStreamAlias("ItemName")
            protected String itemName;

            @XStreamAlias("ItemUserId")
            protected Integer itemUserId;

            @XStreamAlias("ItemImage")
            protected String itemImage;
        }
    }

    // ======== The above is copied from WxCpTpXmlMessage

}
