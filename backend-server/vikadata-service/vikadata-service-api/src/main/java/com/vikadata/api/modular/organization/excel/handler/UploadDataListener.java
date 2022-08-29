package com.vikadata.api.modular.organization.excel.handler;

import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

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
import lombok.extern.slf4j.Slf4j;

import com.vikadata.api.lang.ExcelDataValidateException;
import com.vikadata.api.model.dto.asset.UploadDataDto;
import com.vikadata.api.model.vo.organization.ParseErrorRecordVO;
import com.vikadata.api.modular.organization.service.IMemberService;
import com.vikadata.entity.MemberEntity;

/**
 * <p>
 * 模板数据处理
 * 千万不要交给Spring管理，因为每次使用都要new，处理服务类可以传递进来使用
 * </p>
 *
 * @author Shawn Deng
 * @date 2019/12/16 18:35
 */
@Slf4j
public class UploadDataListener extends AnalysisEventListener<Map<Integer, String>> {

    private final Map<Integer, String> fields = new LinkedHashMap<>(16);

    private final List<ParseErrorRecordVO> errorList = new ArrayList<>();

    private final List<String> sendInviteEmails = new ArrayList<>();

    private final List<String> sendNotifyEmails = new ArrayList<>();

    private final List<Long> memberIds = new ArrayList<>();

    /**
     * 是否具备《管理小组》权限
     */
    private boolean teamCreatable;

    /**
     * 默认最大成员总数
     */
    private final long defaultMaxMemberCount;

    /**
     * 当前成员总数
     */
    private final int currentMemberCount;

    /**
     * 行数
     */
    private int rowCount;

    /**
     * 成功总数
     */
    private int successCount;

    /**
     * 错误总数
     */
    private int errorCount;

    /**
     * 空间ID
     */
    private final String spaceId;

    /**
     * 成员服务
     */
    private final IMemberService iMemberService;

    public UploadDataListener(String spaceId, IMemberService iMemberService, long defaultMaxMemberCount, int currentMemberCount) {
        this.spaceId = spaceId;
        this.iMemberService = iMemberService;
        this.defaultMaxMemberCount = defaultMaxMemberCount;
        this.currentMemberCount = currentMemberCount;
        fields.put(0, "name");
        fields.put(1, "email");
        fields.put(2, "team");
        fields.put(3, "position");
        fields.put(4, "jobNumber");
    }

    public UploadDataListener resources(Set<String> resourceCodes) {
        if (CollUtil.isNotEmpty(resourceCodes)) {
            this.teamCreatable = resourceCodes.contains("CREATE_TEAM");
        }
        return this;
    }

    /**
     * 这个每一条数据解析都会来调用
     *
     * @param data    行数据
     * @param context 上下文信息，类似一个holder
     */
    @Override
    public void invoke(Map<Integer, String> data, AnalysisContext context) {
        int currentRowIndex = context.readRowHolder().getRowIndex();
        int totalDataRow = context.readSheetHolder().getApproximateTotalRowNumber();
        log.info("总行数：{}, 当前行：{}, 解析到数据：{}", totalDataRow, currentRowIndex, JSONUtil.toJsonStr(data));
        //转换对象
        log.info("索引列：{}", JSONUtil.toJsonStr(fields));
        Map<String, String> fieldData = new LinkedHashMap<>(fields.size());
        CollUtil.forEach(fields, (key, value, index) -> fieldData.put(value, MapUtil.getStr(data, key)));
        log.info("转换对象：{}", JSONUtil.toJsonStr(fieldData));
        UploadDataDto rowData = BeanUtil.toBean(fieldData, UploadDataDto.class);
        this.validLimit(currentRowIndex, rowData);
        // 属性校验
        boolean memberExist = validField(currentRowIndex, rowData);
        try {
            // 存储数据
            if (!memberExist) {
                Long memberId = iMemberService.saveUploadData(spaceId, rowData, sendInviteEmails, sendNotifyEmails, teamCreatable);
                memberIds.add(memberId);
            }
            successCount++;
            log.info("存储数据成功!");
        }
        catch (Exception e) {
            errorCount++;
            throw new ExcelDataValidateException(currentRowIndex, rowData, "数据有误，无法保存");
        }
        finally {
            rowCount++;
            // 打印处理进度
            this.printProgress(totalDataRow, currentRowIndex);
        }
    }

    private void validLimit(int rowIndex, UploadDataDto rowData) {
        log.info("空间原成员数：{}, 已成功处理的数量: {}，最大数量限制：{}", currentMemberCount, successCount, defaultMaxMemberCount);
        if (defaultMaxMemberCount == -1) {
            return;
        }
        if (currentMemberCount + successCount == defaultMaxMemberCount) {
            throw new ExcelDataValidateException(rowIndex, rowData, "成员数量已达到上限");
        }
    }

    /**
     * 校验列
     *
     * @param rowIndex 行索引
     * @param rowData  行数据
     */
    private boolean validField(int rowIndex, UploadDataDto rowData) {
        if (StrUtil.isBlank(rowData.getEmail())) {
            throw new ExcelDataValidateException(rowIndex, rowData, "邮箱未填写");
        }
        // 校验邮箱格式
        if (!Validator.isEmail(rowData.getEmail().trim())) {
            throw new ExcelDataValidateException(rowIndex, rowData, "邮箱格式不正确");
        }
        // 校验邮箱重复
        MemberEntity member = iMemberService.getBySpaceIdAndEmail(spaceId, rowData.getEmail());
        if (member != null) {
            if (BooleanUtil.isTrue(member.getIsActive())) {
                throw new ExcelDataValidateException(rowIndex, rowData, "邮箱已存在当前空间站");
            }
            else {
                sendInviteEmails.add(rowData.getEmail());
                memberIds.add(member.getId());
                return true;
            }
        }
        return false;
    }

    /**
     * 打印处理进度
     *
     * @param totalDataRow    总行数
     * @param currentRowIndex 当前行
     */
    private void printProgress(int totalDataRow, int currentRowIndex) {
        NumberFormat numberFormat = NumberFormat.getInstance();
        //计算解析进度
        numberFormat.setMaximumFractionDigits(2);
        String format = numberFormat.format(((float) (currentRowIndex - 2) / (totalDataRow - 3)) * 100).concat("%");
        log.info("解析进度: {}", format);
    }

    /**
     * 这里会一行行的返回头
     *
     * @param headMap 头部Map
     * @param context 上下文信息，类似一个holder
     */
    @Override
    public void invokeHeadMap(Map<Integer, String> headMap, AnalysisContext context) {
        log.info("解析到一条头数据:{}", JSONUtil.toJsonStr(headMap));
    }

    /**
     * 所有数据解析完成了 都会来调用
     *
     * @param context 上下文信息，类似一个holder
     */
    @Override
    public void doAfterAllAnalysed(AnalysisContext context) {
        log.info("所有数据解析完成，确保最后遗留的数据也存储到数据库");
    }

    /**
     * 处理数据转换异常
     *
     * @param exception 异常
     * @param context   上下文信息，类似一个holder
     */
    @Override
    public void onException(Exception exception, AnalysisContext context) {
        log.warn("解析或校验失败，但是继续解析下一行：{}", exception.getMessage());
        if (exception instanceof ExcelDataConvertException) {
            // 如果是某一个单元格的转换异常 能获取到具体行号
            // 如果要获取头的信息 配合invokeHeadMap使用
            // 数据转换异常，我们都是String接收，这是不可能发生的
            ExcelDataConvertException excelDataConvertException = (ExcelDataConvertException) exception;
            log.warn("第{}行，第{}列解析异常", excelDataConvertException.getRowIndex(), excelDataConvertException.getColumnIndex());
        }
        else if (exception instanceof ExcelDataValidateException) {
            // 构造失败列表
            ExcelDataValidateException validateException = (ExcelDataValidateException) exception;
            String errorMessage = exception.getMessage();
            log.warn("第{}行的数据校验不合法，行数据: [{}], 原因:{}",
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
