package com.vikadata.api.modular.workspace.observer.remind;

import java.util.List;

import javax.annotation.Nonnull;
import javax.annotation.Nullable;

import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

import com.vikadata.api.enums.datasheet.RemindType;
import com.vikadata.api.factory.NotifyMailFactory.MailWithLang;
import com.vikadata.api.model.ro.datasheet.RemindExtraRo;

/**
 * <p>
 * 树表操作通知源数据
 * </p>
 *
 * @author Pengap
 * @date 2021/10/9 12:03:15
 */
@Getter
@Setter
@Accessors(chain = true)
public class NotifyDataSheetMeta {

    RemindType remindType;

    String spaceId;

    String nodeId;

    String viewId;

    String recordId;

    String recordTitle;

    String fieldName;

    String createdAt;

    RemindExtraRo extra;

    Long fromMemberId;

    Long fromUserId;

    List<Long> toMemberIds;

    String notifyId;

    String socialTenantId;

    String socialAppId;

    /**
     * 应用类型(1: 企业内部应用, 2: 独立服务商)
     */
    Integer appType;

    MailRemindParameter mailRemindParameter;

    IMRemindParameter imRemindParameter;

    @Getter
    @Setter
    public static class RemindParameter {

        String fromMemberName;

        Boolean fromMemberNameModified;

        @Nullable
        String spaceName;

        String nodeName;

        @Nonnull
        String notifyUrl;
    }

    @Getter
    @Setter
    public static class MailRemindParameter extends RemindParameter {

        @Nullable
        List<MailWithLang> sendEmails;
    }

    @Getter
    @Setter
    public static class IMRemindParameter extends RemindParameter {

        @Nullable
        String fromOpenId;

        @Nullable
        List<String> sendOpenIds;
    }

}
