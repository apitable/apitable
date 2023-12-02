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

package com.apitable.space.service;

import com.apitable.space.entity.LabsApplicantEntity;
import com.apitable.space.enums.LabsApplicantTypeEnum;
import com.apitable.space.vo.LabsFeatureVo;
import com.baomidou.mybatisplus.extension.service.IService;
import java.util.List;

/**
 * <p>
 * Service class of experimental function application form.
 * </p>
 */
public interface ILabsApplicantService extends IService<LabsApplicantEntity> {

    /**
     * Query the laboratory functions of the current user and the empty room station according to the user ID and space ID.
     *
     * @param applicants Applicant I Ds, which are user id or space id
     * @return LabsApplicantEntity List
     */
    LabsFeatureVo getUserCurrentFeatureApplicants(List<String> applicants);

    /**
     * Get the specified experimental functions enabled by the applicant or the space station where the user resides.
     *
     * @param applicant  The unique identifier of the applicant, which can be space ID or user ID
     * @param featureKey Name of experimental function
     * @return LabsApplicantEntity
     */
    LabsApplicantEntity getApplicantByApplicantAndFeatureKey(String applicant, String featureKey);

    /**
     * Enable the designated experimental internal test function for the user's space.
     *
     * @param applicant  User ID or space ID
     * @param featureKey Unique identification of experimental function to be opened
     */
    void enableLabsFeature(String applicant, LabsApplicantTypeEnum applicantType, String featureKey,
                           Long operator);

    /**
     * Turn off the designated experimental internal test function for the user's space.
     *
     * @param applicant  User ID or space ID
     * @param featureKey Unique identification of experimental function to be closed
     */
    void disableLabsFeature(String applicant, String featureKey);
}
