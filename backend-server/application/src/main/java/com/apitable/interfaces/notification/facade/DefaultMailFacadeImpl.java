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

import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;
import org.springframework.core.io.ClassPathResource;

/**
 * Default Mail Facade Implement Class.
 *
 * @author Chambers
 */
public class DefaultMailFacadeImpl extends AbstractMailFacade {

    /**
     * * Get Cloud Mail Template Id.
     *
     * @param lang    language
     * @param subject mail subject
     * @return template id about cloud mail
     */
    @Override
    public Long getCloudMailTemplateId(final String lang, final String subject) {
        return DefaultMailTemplateLoader.getTemplateId(subject);
    }

    /**
     * * Get Subject Properties.
     *
     * @param locale locale
     * @return Properties
     * @throws IOException io exception
     */
    @Override
    public Properties getSubjectProperties(final String locale)
        throws IOException {
        final Properties properties = new Properties();
        ClassPathResource defaultResource =
            new ClassPathResource("templates/notification/subject.properties");
        try (InputStream in = defaultResource.getInputStream()) {
            properties.load(in);
        }
        return properties;
    }

}
