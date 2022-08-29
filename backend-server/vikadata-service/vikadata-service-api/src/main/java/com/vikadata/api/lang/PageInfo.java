package com.vikadata.api.lang;

import java.util.Collections;
import java.util.List;

import cn.hutool.core.collection.CollUtil;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

/**
 * <p>
 * 完整分页对象
 * </p>
 *
 * @author Shawn Deng
 * @date 2018/9/27 17:07
 */
@Data
@ApiModel("分页结果")
public class PageInfo<T> {

    /**
     * 当前页
     */
    @ApiModelProperty(value = "当前页", example = "1", position = 1)
    private int pageNum;

    /**
     * 每页的数量
     */
    @ApiModelProperty(value = "每页的数量", example = "10", position = 2)
    private int pageSize;

    /**
     * 当前页的数量
     */
    @ApiModelProperty(value = "当前页的数量", example = "6", position = 3)
    private int size;

    /**
     * 总记录数
     */
    @ApiModelProperty(value = "总记录数", example = "100", position = 4)
    private int total;

    /**
     * 总页数
     */
    @ApiModelProperty(value = "总页数", example = "3", position = 5)
    private int pages;

    /**
     * 当前页面第一个元素在数据库中的行号
     */
    @ApiModelProperty(value = "当前页面第一个元素的行号", example = "1", position = 6)
    private int startRow;

    /**
     * 当前页面最后一个元素在数据库中的行号
     */
    @ApiModelProperty(value = "当前页面最后一个元素的行号", example = "1", position = 7)
    private int endRow;

    /**
     * 前一页
     */
    @ApiModelProperty(value = "前一页", example = "0", position = 8)
    private int prePage;

    /**
     * 下一页
     */
    @ApiModelProperty(value = "下一页", example = "2", position = 9)
    private int nextPage;

    /**
     * 是否为第一页
     */
    @ApiModelProperty(value = "是否为第一页", example = "true", position = 10)
    private Boolean firstPage = false;

    /**
     * 是否为最后一页
     */
    @ApiModelProperty( value = "是否为最后一页", example = "false", position = 11)
    private Boolean lastPage = false;

    /**
     * 是否有前一页
     */
    @ApiModelProperty(value = "是否有前一页", example = "false", position = 12)
    private boolean hasPreviousPage = false;

    /**
     * 是否有下一页
     */
    @ApiModelProperty(value = "是否有下一页", example = "true", position = 1)
    private boolean hasNextPage = false;

    /**
     * 查询数据列表
     */
    private List<T> records = Collections.emptyList();

    public PageInfo() {
        //Do Nothing
    }

    public PageInfo(int pageNum, int pageSize, int total, List<T> records) {
        this.pageNum = pageNum;
        this.pageSize = pageSize;
        this.total = total;
        // 针对手动设置 total，查询结果集超过时进行矫正
        calculateSize(records);

        this.prePage = pageNum - 1;
        calculatePages();
        calculateStartAndEndRow();
        calcPage();
        judgePageBoundary();
    }

    /**
     * 计算当前页的数量
     */
    private void calculateSize(List<T> records) {
        if (CollUtil.isEmpty(records)) {
            this.size = 0;
            return;
        }
        // 计算总数与所有前页总行数的差值
        int sub = this.total - ((this.pageNum - 1) * this.pageSize);
        // 差值为负数，当前页返回空集
        if (sub <= 0) {
            this.size = 0;
            return;
        }
        // 差数满足查询结果数，正常全部返回
        if (sub >= records.size()) {
            this.records = records;
            this.size = records.size();
            return;
        }
        // 差值不足，取差值部分返回
        this.records = records.subList(0, sub);
        this.size = sub;
    }

    /**
     * 计算总页数
     *
     * @author Shawn Deng
     * @date 2018/9/27 19:49
     */
    private void calculatePages() {
        if (getPageSize() == 0) {
            this.pages = 0;
        }
        int pages = getTotal() / getPageSize();
        if (getTotal() % getPageSize() != 0) {
            pages++;
        }
        this.pages = pages;
    }

    /**
     * 计算起止行号
     *
     * @author Shawn Deng
     * @date 2018/9/27 19:46
     */
    private void calculateStartAndEndRow() {
        if (this.pageNum > 0) {
            this.startRow = ((this.pageNum - 1) * this.pageSize) + 1;
        }
        else {
            this.startRow = 0;
        }

        this.endRow = this.startRow - 1 + this.size;
    }

    /**
     * 计算前后页
     *
     * @author Shawn Deng
     * @date 2018/9/27 19:54
     */
    private void calcPage() {
        if (pageNum > 1) {
            prePage = pageNum - 1;
        }
        else {
            prePage = 1;
        }
        if (pageNum < pages) {
            nextPage = pageNum + 1;
        }
        else {
            nextPage = pages;
        }
    }

    /**
     * 判定页面边界
     *
     * @author Shawn Deng
     * @date 2018/9/27 19:53
     */
    private void judgePageBoundary() {
        firstPage = pageNum == 1;
        lastPage = pageNum == pages || pages == 0;
        hasPreviousPage = pageNum > 1;
        hasNextPage = pageNum < pages;
    }
}
