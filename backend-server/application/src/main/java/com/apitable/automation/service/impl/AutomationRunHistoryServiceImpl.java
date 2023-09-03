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

package com.apitable.automation.service.impl;

import com.apitable.automation.service.IAutomationRunHistoryService;
import com.apitable.databusclient.ApiException;
import com.apitable.databusclient.api.AutomationDaoApiApi;
import javax.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

/**
 * Automation run history interface implement.
 */
@Slf4j
@Service
public class AutomationRunHistoryServiceImpl implements IAutomationRunHistoryService {

    @Resource
    private AutomationDaoApiApi automationDaoApiApi;

    @Override
    public void getRobotRunHistory(String robotId) throws ApiException {
        automationDaoApiApi.daoGetAutomationRunHistory(robotId);
    }
}
