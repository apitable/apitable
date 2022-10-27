import { Controller, Get, Param, Headers, Post, Body, UseInterceptors } from '@nestjs/common';
import { FormService } from '../services/form/form.service';
import { NodeService } from 'database/services/node/node.service';
import { UserService } from 'database/services/user/user.service';
import { ResourceDataInterceptor } from 'shared/middleware/resource.data.interceptor';
import { FormDataPack } from '../interfaces';
import { ServerException } from '../../shared/exception/server.exception';
import { PermissionException } from '../../shared/exception/permission.exception';
import { NodeShareSettingService } from 'database/services/node/node.share.setting.service';
import { IFormProps, IRecordCellValue } from '@apitable/core';

/**
 * 神奇表单接口
 */
@Controller('nest/v1')
export class FormController {
  constructor(
    private readonly userService: UserService,
    private readonly nodeService: NodeService,
    private readonly formService: FormService,
    private readonly nodeShareSettingService: NodeShareSettingService,
  ) { }

  @Get(['forms/:formId/dataPack', 'form/:formId/dataPack'])
  @UseInterceptors(ResourceDataInterceptor)
  async getDataPack(@Headers('cookie') cookie: string, @Param('formId') formId: string): Promise<FormDataPack> {
    // 检查当前用户是否在当前空间
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, formId);
    return await this.formService.fetchDataPack(formId, { cookie });
  }

  @Get(['shares/:shareId/forms/:formId/dataPack', 'share/:shareId/form/:formId/dataPack'])
  @UseInterceptors(ResourceDataInterceptor)
  async getShareDataPack(
    @Headers('cookie') cookie: string, @Param('shareId') shareId: string, @Param('formId') formId: string
  ): Promise<FormDataPack> {
    // 校验节点是否在分享之列
    await this.nodeShareSettingService.checkNodeHasOpenShare(shareId, formId);
    // 这里只是为了获取 userId，非强制登陆才可见，
    // 但是 getMe 接口，对于未登录用户会进行报错，
    // 并且考虑它处都有使用 getMe 接口，故只在此进行 catch，防止异常
    const { userId } = await this.userService.getMeNullable(cookie);
    return await this.formService.fetchShareDataPack(formId, shareId, userId, { cookie });
  }

  @Get(['templates/:templateId/forms/:formId/dataPack', 'template/:templateId/form/:formId/dataPack'])
  async getTemplateDataPack(
    @Headers('cookie') cookie: string, @Param('templateId') templateId: string, @Param('formId') formId: string
  ): Promise<FormDataPack> {
    const isTemplate = await this.nodeService.isTemplate(formId);
    if (!isTemplate) {
      throw new ServerException(PermissionException.OPERATION_DENIED);
    }
    return await this.formService.fetchDataPack(formId, { cookie }, templateId);
  }

  @Get(['forms/:formId/submitStatus', 'form/:formId/submitStatus'])
  async fetchSubmitStatus(@Headers('cookie') cookie: string, @Param('formId') formId: string): Promise<boolean> {
    const { userId } = await this.userService.getMe({ cookie });
    return await this.formService.fetchSubmitStatus(userId, formId);
  }

  @Post(['forms/:formId/addRecord', 'form/:formId/addRecord'])
  async addFormRecord(
    @Headers('cookie') cookie: string, @Param('formId') formId: string, @Body() recordData: IRecordCellValue
  ): Promise<any> {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, formId);
    return await this.formService.addRecord({ formId, recordData, userId }, { cookie });
  }

  @Post(['shares/:shareId/forms/:formId/addRecord', 'share/:shareId/form/:formId/addRecord'])
  async addShareFormRecord(
    @Headers('cookie') cookie: string, @Param('shareId') shareId: string, @Param('formId') formId: string, @Body() recordData: IRecordCellValue
  ): Promise<any> {
    // 校验节点是否在分享之列
    await this.nodeShareSettingService.checkNodeHasOpenShare(shareId, formId);
    const formProps = await this.formService.fetchFormProps(formId);
    const { fillAnonymous } = formProps;
    let userId = '';
    // 默认非匿名填写，如匿名填写则无需检查
    if (!fillAnonymous) {
      const user = await this.userService.getMe({ cookie });
      userId = user.userId;
    }
    return await this.formService.addRecord({ formId, shareId, userId, recordData }, { cookie });
  }

  @Get(['forms/:formId/props', 'form/:formId/props'])
  async getFormProps(@Headers('cookie') cookie: string, @Param('formId') formId: string): Promise<any> {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, formId);
    return await this.formService.fetchFormProps(formId);
  }

  @Post(['forms/:formId/props', 'form/:formId/props'])
  async updateFormProps(@Headers('cookie') cookie: string, @Param('formId') formId: string, @Body() formProps: IFormProps): Promise<any> {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, formId);
    return await this.formService.updateFormProps(userId, formId, formProps);
  }
}
