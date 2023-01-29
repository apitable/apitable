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

<<<<<<< HEAD:apitable/backend-server/application/src/main/java/com/apitable/interfaces/notification/facade/DefaultMailFacadeImpl.java
package com.apitable.interfaces.notification.facade;

public class DefaultMailFacadeImpl implements MailFacade {

    @Override
    public Long getCloudMailTemplateId(String lang, String subject) {
        return DefaultMailTemplateLoader.getTemplateId(subject);
    }
}
=======
/**
 *
 * @author Chambers
 */
package com.apitable.interfaces.notification.facade;
>>>>>>> 6895a8bbee110350652686c5b2867b33850cca08:apitable/backend-server/application/src/main/java/com/apitable/interfaces/notification/facade/package-info.java
