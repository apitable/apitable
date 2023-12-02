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

package com.apitable.shared.component;

import static org.springframework.boot.autoconfigure.task.TaskExecutionAutoConfiguration.APPLICATION_TASK_EXECUTOR_BEAN_NAME;

import com.apitable.core.util.SpringContextHolder;
import java.util.concurrent.Executor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

/**
 * <p>
 * Asynchronous Thread Task Manager.
 * </p>
 *
 * @author Shawn Deng
 */
@Component
@Slf4j
public class TaskManager {

    public static TaskManager me() {
        return SpringContextHolder.getBean(TaskManager.class);
    }

    public void execute(Runnable runnable) {
        SpringContextHolder.getBean(APPLICATION_TASK_EXECUTOR_BEAN_NAME, Executor.class)
            .execute(runnable);
    }
}
