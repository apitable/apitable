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

package com.apitable.organization.excel.handler;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.collection.CollUtil;
import cn.hutool.core.lang.Validator;
import cn.hutool.core.map.MapUtil;
import cn.hutool.core.util.BooleanUtil;
import cn.hutool.core.util.StrUtil;
import cn.hutool.json.JSONUtil;
import com.alibaba.excel.context.AnalysisContext;
import com.alibaba.excel.event.AnalysisEventListener;
import com.alibaba.excel.exception.ExcelDataConvertException;
import com.apitable.core.exception.BusinessException;
import com.apitable.organization.dto.UploadDataDTO;
import com.apitable.organization.entity.MemberEntity;
import com.apitable.organization.service.IMemberService;
import com.apitable.organization.vo.ParseErrorRecordVO;
import com.apitable.shared.exception.LimitException;
import com.apitable.shared.util.excel.ExcelDataValidateException;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import lombok.extern.slf4j.Slf4j;

/**
 * <p>
 * template data processor.
 * </p>
 * Don't leave it to Spring to manage.
 * Because you need new every time you use it, and the processing service class can be passed in for use.
 * </p>
 */
@Slf4j
public class UploadDataListener extends AnalysisEventListener<Map<Integer, String>> {

    private final Map<Integer, String> fields = new LinkedHashMap<>(16);

    private final List<ParseErrorRecordVO> errorList = new ArrayList<>();

    private final List<String> sendInviteEmails = new ArrayList<>();

    private final List<String> sendNotifyEmails = new ArrayList<>();

    private final List<Long> memberIds = new ArrayList<>();

    /**
     * whether user have the permission "CREATE_TEAM".
     */
    private boolean teamCreatable;

    /**
     * default maximum number of members.
     */
    private final long defaultMaxMemberCount;

    /**
     * total current members.
     */
    private final int currentMemberCount;

    /**
     * row count.
     */
    private int rowCount;

    /**
     * success count.
     */
    private int successCount;

    /**
     * error count.
     */
    private int errorCount;

    /**
     * space id.
     */
    private final String spaceId;

    private final IMemberService iMemberService;

    /**
     * constructor.
     *
     * @param spaceId               space id
     * @param memberService         member service
     * @param defaultMaxMemberCount default maximum number of members
     * @param currentMemberCount    total current members
     */
    public UploadDataListener(String spaceId, IMemberService memberService,
                              long defaultMaxMemberCount, int currentMemberCount) {
        this.spaceId = spaceId;
        this.iMemberService = memberService;
        this.defaultMaxMemberCount = defaultMaxMemberCount;
        this.currentMemberCount = currentMemberCount;
        fields.put(0, "name");
        fields.put(1, "email");
        fields.put(2, "team");
        fields.put(3, "position");
        fields.put(4, "jobNumber");
    }

    /**
     * set resource codes.
     *
     * @param resourceCodes resource codes
     * @return this
     */
    public UploadDataListener resources(Set<String> resourceCodes) {
        if (CollUtil.isNotEmpty(resourceCodes)) {
            this.teamCreatable = resourceCodes.contains("CREATE_TEAM");
        }
        return this;
    }

    /**
     * This method is called for every data parse.
     *
     * @param data    a row data
     * @param context handle context
     */
    @Override
    public void invoke(Map<Integer, String> data, AnalysisContext context) {
        int currentRowIndex = context.readRowHolder().getRowIndex();
        int totalDataRow = context.readSheetHolder().getApproximateTotalRowNumber();
        log.info("Total rows：{}, current row：{}, parsed data：{}", totalDataRow, currentRowIndex,
            JSONUtil.toJsonStr(data));
        // convert object
        log.info("index row：{}", JSONUtil.toJsonStr(fields));
        Map<String, String> fieldData = new LinkedHashMap<>(fields.size());
        CollUtil.forEach(fields,
            (key, value, index) -> fieldData.put(value, MapUtil.getStr(data, key)));
        log.info("convert object：{}", JSONUtil.toJsonStr(fieldData));
        UploadDataDTO rowData = BeanUtil.toBean(fieldData, UploadDataDTO.class);
        this.validLimit();
        // validate fields
        boolean memberExist = validField(currentRowIndex, rowData);
        try {
            // data storage
            if (!memberExist) {
                Long memberId = iMemberService.saveUploadData(spaceId, rowData, sendInviteEmails,
                    sendNotifyEmails, teamCreatable);
                memberIds.add(memberId);
            }
            successCount++;
            log.info("Data storage success!");
        } catch (Exception e) {
            errorCount++;
            throw new ExcelDataValidateException(currentRowIndex, rowData,
                "the data is incorrect and cannot be saved");
        } finally {
            rowCount++;
            // print processing progress
            this.printProgress(totalDataRow, currentRowIndex);
        }
    }

    private void validLimit() {
        log.info(
            "the space original member number：{}, the number of successful processes: {}，max member number：{}",
            currentMemberCount, successCount, defaultMaxMemberCount);
        if (defaultMaxMemberCount == -1) {
            return;
        }
        if (currentMemberCount + successCount >= defaultMaxMemberCount) {
            // Specify exception
            throw new BusinessException(LimitException.SEATS_OVER_LIMIT);
        }
    }

    /**
     * check column.
     *
     * @param rowIndex row index
     * @param rowData  row data
     */
    private boolean validField(int rowIndex, UploadDataDTO rowData) {
        if (StrUtil.isBlank(rowData.getEmail())) {
            throw new ExcelDataValidateException(rowIndex, rowData, "email not filled in");
        }
        // verifying email format
        if (!Validator.isEmail(rowData.getEmail().trim())) {
            throw new ExcelDataValidateException(rowIndex, rowData,
                "the email format is incorrect");
        }
        // verifying email duplication
        MemberEntity member = iMemberService.getBySpaceIdAndEmail(spaceId, rowData.getEmail());
        if (member != null) {
            if (BooleanUtil.isTrue(member.getIsActive())) {
                throw new ExcelDataValidateException(rowIndex, rowData,
                    "The email already exist in the current space");
            } else {
                sendInviteEmails.add(rowData.getEmail());
                memberIds.add(member.getId());
                return true;
            }
        }
        return false;
    }

    /**
     * print processing progress.
     *
     * @param totalDataRow    row data
     * @param currentRowIndex current row index
     */
    private void printProgress(int totalDataRow, int currentRowIndex) {
        NumberFormat numberFormat = NumberFormat.getInstance();
        // compute parsing progress
        numberFormat.setMaximumFractionDigits(2);
        String format =
            numberFormat.format(((float) (currentRowIndex - 2) / (totalDataRow - 3)) * 100)
                .concat("%");
        log.info("analytical progress: {}", format);
    }

    /**
     * handle head row.
     *
     * @param headMap head row map
     * @param context context
     */
    @Override
    public void invokeHeadMap(Map<Integer, String> headMap, AnalysisContext context) {
        log.info("parse to a header:{}", JSONUtil.toJsonStr(headMap));
    }

    /**
     * This method is called when all data parsing is complete.
     *
     * @param context processing context
     */
    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        log.info(
            "All data parsing is complete. Make sure the last remaining data is also stored in the database");
    }

    /**
     * Handle data conversion exceptions.
     *
     * @param exception exception
     * @param context   handle context
     */
    @Override
    public void onException(Exception exception, AnalysisContext context) {
        log.warn("parsing or validation failed，continue next row：{}", exception.getMessage());
        if (exception instanceof ExcelDataConvertException excelDataConvertException) {
            // If one of the cell conversion exception, get the row number。
            // If get header information, please use invokeHeadMap
            // Data conversion exception, which cannot happen.
            log.warn("the number {} row，the number {} col parsing exceptions",
                excelDataConvertException.getRowIndex(),
                excelDataConvertException.getColumnIndex());
        } else if (exception instanceof ExcelDataValidateException validateException) {
            // construct failure list
            String errorMessage = exception.getMessage();
            log.warn("the {} row data illegal，data: [{}], reason:{}",
                validateException.getRowIndex(),
                JSONUtil.toJsonStr(validateException.getRowData()),
                errorMessage);
            errorCount++;
            errorList.add(ParseErrorRecordVO.builder()
                .rowNumber(validateException.getRowIndex() + 1)
                .name(validateException.getRowData().getName())
                .email(validateException.getRowData().getEmail())
                .team(validateException.getRowData().getTeam())
                .message(errorMessage).build());
        } else if (exception instanceof BusinessException) {
            // If the seat limit is exceeded
            // specified exception needs to be thrown so that the front-end pop-up window prompts
            throw new BusinessException(LimitException.SEATS_OVER_LIMIT);
        }
    }

    public List<String> getSendInviteEmails() {
        return sendInviteEmails;
    }

    public List<String> getSendNotifyEmails() {
        return sendNotifyEmails;
    }

    public List<Long> getMemberIds() {
        return memberIds;
    }

    public int getRowCount() {
        return rowCount;
    }

    public int getSuccessCount() {
        return successCount;
    }

    public int getErrorCount() {
        return errorCount;
    }

    public List<ParseErrorRecordVO> getErrorList() {
        return errorList;
    }
}
