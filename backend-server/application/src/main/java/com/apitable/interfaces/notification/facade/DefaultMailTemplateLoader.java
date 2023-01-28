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

package com.apitable.interfaces.notification.facade;

import java.util.HashMap;
import java.util.Map;

import static com.apitable.shared.constants.MailPropConstants.SUBJECT_CHANGE_ADMIN;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_DATASHEET_REMIND;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_INVITE_NOTIFY;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_RECORD_COMMENT;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_REGISTER;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_REMOVE_MEMBER;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_SPACE_APPLY;
import static com.apitable.shared.constants.MailPropConstants.SUBJECT_VERIFY_CODE;

public class DefaultMailTemplateLoader {

    public static Long getTemplateId(String subject) {
        return Singleton.INSTANCE.getTemplateId(subject);
    }

    private enum Singleton {
        INSTANCE;

        private final Map<String, Long> singleton = new HashMap<>();

        Singleton() {
            singleton.put(SUBJECT_CHANGE_ADMIN, 0L);
            singleton.put(SUBJECT_INVITE_NOTIFY, 1L);
            singleton.put(SUBJECT_REGISTER, 2L);
            singleton.put(SUBJECT_RECORD_COMMENT, 3L);
            singleton.put(SUBJECT_DATASHEET_REMIND, 4L);
            singleton.put(SUBJECT_REMOVE_MEMBER, 5L);
            singleton.put(SUBJECT_SPACE_APPLY, 6L);
            singleton.put(SUBJECT_VERIFY_CODE, 7L);
        }

        public Long getTemplateId(String subject) {
            return singleton.get(subject);
        }
    }
}
