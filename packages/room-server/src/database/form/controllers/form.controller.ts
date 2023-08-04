/**
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

import { IFormProps, IRecordCellValue } from '@apitable/core';
import { Body, Controller, Get, Headers, Param, Post, UseInterceptors } from '@nestjs/common';
import { NodeService } from 'node/services/node.service';
import { NodeShareSettingService } from 'node/services/node.share.setting.service';
import { UserService } from 'user/services/user.service';
import { PermissionException, ServerException } from 'shared/exception';
import { ResourceDataInterceptor } from 'database/resource/middleware/resource.data.interceptor';
import { FormDataPack } from '../../interfaces';
import { FormService } from '../services/form.service';

/**
 * Form APIs
 */
@Controller('nest/v1')
export class FormController {
  constructor(
    private readonly userService: UserService,
    private readonly nodeService: NodeService,
    private readonly formService: FormService,
    private readonly nodeShareSettingService: NodeShareSettingService,
  ) { }

  @Get(['forms/:formId/meta', 'forms/:formId/dataPack'])
  @UseInterceptors(ResourceDataInterceptor)
  async getDataPack(@Headers('cookie') cookie: string, @Param('formId') formId: string): Promise<FormDataPack> {
    // check if the current user is belonging to this space
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, formId);
    return await this.formService.fetchDataPack(formId, { cookie });
  }

  @Get(['shares/:shareId/forms/:formId/meta', 'shares/:shareId/forms/:formId/dataPack'])
  @UseInterceptors(ResourceDataInterceptor)
  async getShareDataPack(
    @Headers('cookie') cookie: string, @Param('shareId') shareId: string, @Param('formId') formId: string
  ): Promise<FormDataPack> {
    // check if the node has been shared
    await this.nodeShareSettingService.checkNodeHasOpenShare(shareId, formId);
    // Only works for logged-in user 
    // would throw exception if the user is not logged-in
    const { userId } = await this.userService.getMeNullable(cookie);
    return await this.formService.fetchShareDataPack(formId, shareId, userId, { cookie });
  }

  @Get(['templates/:templateId/forms/:formId/meta', 'templates/:templateId/forms/:formId/dataPack'])
  async getTemplateDataPack(
    @Headers('cookie') cookie: string, @Param('templateId') templateId: string, @Param('formId') formId: string
  ): Promise<FormDataPack> {
    const isTemplate = await this.nodeService.isTemplate(formId);
    if (!isTemplate) {
      throw new ServerException(PermissionException.OPERATION_DENIED);
    }
    return await this.formService.fetchDataPack(formId, { cookie }, templateId);
  }

  @Get('forms/:formId/submitStatus')
  async fetchSubmitStatus(@Headers('cookie') cookie: string, @Param('formId') formId: string): Promise<boolean> {
    const { userId } = await this.userService.getMe({ cookie });
    return await this.formService.fetchSubmitStatus(userId, formId);
  }

  @Post('forms/:formId/addRecord')
  async addFormRecord(
    @Headers('cookie') cookie: string, @Param('formId') formId: string, @Body() recordData: IRecordCellValue
  ): Promise<any> {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, formId);
    return await this.formService.addRecord({ formId, userId, recordData }, { cookie });
  }

  @Post('shares/:shareId/forms/:formId/addRecord')
  async addShareFormRecord(
    @Headers('cookie') cookie: string, @Param('shareId') shareId: string, @Param('formId') formId: string, @Body() recordData: IRecordCellValue
  ): Promise<any> {
    // check if the node has been shared
    await this.nodeShareSettingService.checkNodeHasOpenShare(shareId, formId);
    const formProps = await this.formService.fetchFormProps(formId);
    const { fillAnonymous } = formProps;
    let userId = '';
    // real-name by default, no need check anonymous
    if (!fillAnonymous) {
      const user = await this.userService.getMe({ cookie });
      userId = user.userId;
    }
    return await this.formService.addRecord({ formId, shareId, userId, recordData }, { cookie });
  }

  @Get('forms/:formId/props')
  async getFormProps(@Headers('cookie') cookie: string, @Param('formId') formId: string): Promise<any> {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, formId);
    return await this.formService.fetchFormProps(formId);
  }

  @Post('forms/:formId/props')
  async updateFormProps(@Headers('cookie') cookie: string, @Param('formId') formId: string, @Body() formProps: IFormProps): Promise<any> {
    const { userId } = await this.userService.getMe({ cookie });
    await this.nodeService.checkUserForNode(userId, formId);
    return await this.formService.updateFormProps(userId, formId, formProps);
  }
}
