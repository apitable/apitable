package com.vikadata.api.model.ro.asset;

import java.util.List;

import javax.validation.constraints.NotNull;

import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;
import lombok.Data;

@Data
@ApiModel("Image review result request parameters")
public class AttachAuditCallbackRo {

	@ApiModelProperty(value = "处理任务的persistentID", position = 1, required = true)
	@NotNull
	private String id;

	@ApiModelProperty(value = "处理队列名", position = 2, required = true)
	@NotNull
	private String pipeline;

	@ApiModelProperty(value = "状态码0成功，1等待处理，2正在处理，3处理失败，4通知提交失败", position = 3, required = true)
	@NotNull
	private Integer code;

	@ApiModelProperty(value = "与状态码相对应的详细描述", position = 4, required = true)
	@NotNull
	private String desc;

	@ApiModelProperty(value = "云处理请求的请求id，主要用于七牛技术人员的问题排查", position = 5, required = true)
	@NotNull
	private String reqid;

	@ApiModelProperty(value = "处理源文件所在的空间名", position = 6, required = true)
	@NotNull
	private String inputBucket;

	@ApiModelProperty(value = "处理源文件的文件名", position = 7, required = true)
	@NotNull
	private String inputKey;

	@ApiModelProperty(value = "处理文件后的回调结果", position = 8, required = true)
	@NotNull
	private List<AttachAuditItemsRo> items;
}
