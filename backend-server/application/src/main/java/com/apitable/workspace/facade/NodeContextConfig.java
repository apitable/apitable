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

package com.apitable.workspace.facade;

import com.apitable.workspace.mapper.NodeMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnMissingBean;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

/**
 * Node Context Config.
 *
 * @author Chambers
 */
@Configuration(proxyBeanMethods = false)
public class NodeContextConfig {

    private static final Logger logger = LoggerFactory.getLogger(NodeContextConfig.class);

    @Bean
    @ConditionalOnMissingBean
    public NodeFacade defaultCTENodeFacadeImpl(NodeMapper nodeMapper) {
        logger.debug("Inject CTE node facade implement class.");
        return new DefaultCTENodeFacadeImpl(nodeMapper);
    }

    @Bean
    @Primary
    @ConditionalOnProperty(value = "cte-sql.enabled", havingValue = "false")
    public NodeFacade nonCTENodeFacadeImpl(NodeMapper nodeMapper) {
        logger.debug("Inject No-CTE node facade implement class.");
        return new NonCTENodeFacadeImpl(nodeMapper);
    }
}
