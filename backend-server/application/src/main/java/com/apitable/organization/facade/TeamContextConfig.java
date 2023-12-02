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

package com.apitable.organization.facade;

import com.apitable.organization.mapper.TeamMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Team Context Config.
 *
 * @author Chambers
 */
@Configuration(proxyBeanMethods = false)
public class TeamContextConfig {

    private static final Logger logger = LoggerFactory.getLogger(TeamContextConfig.class);

    @Bean
    @ConditionalOnMissingBean
    public TeamFacade defaultCTETeamFacadeImpl(TeamMapper teamMapper) {
        logger.debug("Inject CTE team facade implement class.");
        return new DefaultCTETeamFacadeImpl(teamMapper);
    }

    @Bean
    @Primary
    @ConditionalOnProperty(value = "cte-sql.enabled", havingValue = "false")
    public TeamFacade nonCTETeamFacadeImpl(TeamMapper teamMapper) {
        logger.debug("Inject No-CTE team facade implement class.");
        return new NonCTETeamFacadeImpl(teamMapper);
    }
}
