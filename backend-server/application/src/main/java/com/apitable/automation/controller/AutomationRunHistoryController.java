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

package com.apitable.automation.controller;

import com.apitable.automation.model.AutomationRunHistoryRo;
import com.apitable.automation.service.IAutomationRunHistoryService;
import com.apitable.core.support.ResponseData;
import com.apitable.databusclient.ApiException;
import com.apitable.shared.component.scanner.annotation.ApiResource;
import com.apitable.shared.component.scanner.annotation.PostResource;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import javax.annotation.Resource;
import javax.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.RestController;

/**
 * Automation run history controller.
 */
@RestController
@Tag(name = "Authorization related interface")
@ApiResource(path = {"/automation/run-history"})
@Slf4j
public class AutomationRunHistoryController {

    @Resource
    private IAutomationRunHistoryService iAutomationRunHistoryService;

    /**
     * Get automation run history.
     *
     * @param query query object
     * @return {@link ResponseData}
     */
    @PostResource(path = "/", requiredPermission = false)
    @Operation(summary = "Get automation run history")
    public ResponseData<Void> getRunHistory(@Valid final AutomationRunHistoryRo query)
        throws ApiException {
        iAutomationRunHistoryService.getRobotRunHistory(query.getRobotId());
        return ResponseData.success();
    }
}
