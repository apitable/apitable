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

package com.apitable.shared.captcha;

import com.apitable.core.util.SpringContextHolder;
import java.util.Map;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * <p>
 * captcha processing manager.
 * </p>
 *
 * @author Shawn Deng
 */
@Component
public class ValidateCodeProcessorManage {

    private final Map<String, ValidateCodeProcessor> validateCodeProcessors;

    @Autowired
    public ValidateCodeProcessorManage(Map<String, ValidateCodeProcessor> validateCodeProcessors) {
        this.validateCodeProcessors = validateCodeProcessors;
    }

    public static ValidateCodeProcessorManage me() {
        return SpringContextHolder.getBean(ValidateCodeProcessorManage.class);
    }

    public ValidateCodeProcessor findValidateCodeProcessor(ValidateCodeType type) {
        return findValidateCodeProcessor(type.toString().toLowerCase());
    }

    /**
     * find captcha processor by type.
     *
     * @param type captcha type
     * @return captcha processor
     */
    public ValidateCodeProcessor findValidateCodeProcessor(String type) {
        String name = type.toLowerCase() + ValidateCodeProcessor.class.getSimpleName();
        ValidateCodeProcessor processor = validateCodeProcessors.get(name);
        if (processor == null) {
            throw new RuntimeException("captcha processor " + name + " is not exist");
        }
        return processor;
    }
}
