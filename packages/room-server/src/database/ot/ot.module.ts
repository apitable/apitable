import { Module } from '@nestjs/common';
import { DashboardModule } from 'database/dashboard/dashboard.module';
import { DatasheetModule } from 'database/datasheet/datasheet.module';
import { FormModule } from 'database/form/form.module';
import { MirrorModule } from 'database/mirror/mirror.module';
import { NodeModule } from 'database/node/node.module';
import { WidgetModule } from 'database/widget/widget.module';
import { DashboardOtService } from './services/dashboard.ot.service';
import { DatasheetOtService } from './services/datasheet.ot.service';
import { FormOtService } from './services/form.ot.service';
import { MirrorOtService } from './services/mirror.ot.service';
import { OtService } from './services/ot.service';
import { ResourceChangeHandler } from './services/resource.change.handler';
import { WidgetOtService } from './services/widget.ot.service';

@Module({
  imports: [NodeModule, DatasheetModule, WidgetModule, FormModule, MirrorModule, DashboardModule],
  providers: [
    OtService,
    DatasheetOtService,
    DashboardOtService,
    MirrorOtService,
    FormOtService,
    WidgetOtService,
    ResourceChangeHandler,
  ],
  exports: [
    OtService,
    DatasheetOtService,
    DashboardOtService,
    MirrorOtService,
    FormOtService,
    WidgetOtService,
    ResourceChangeHandler,
  ]
})
export class OtModule {}
