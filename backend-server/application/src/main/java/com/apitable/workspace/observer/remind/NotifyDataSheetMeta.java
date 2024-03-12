/*
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package com.apitable.workspace.observer.remind;

import com.apitable.workspace.ro.RemindExtraRo;
import jakarta.annotation.Nonnull;
import jakarta.annotation.Nullable;
import java.util.List;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.Accessors;

/**
 * <p>
 * datasheet operation notification source data.
 * </p>
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

    String fromUserAvatar;

    List<Long> toMemberIds;

    String notifyId;

    RemindParameter remindParameter;

    /**
     * remind parameter.
     */
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
}
