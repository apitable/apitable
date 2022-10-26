import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetRepository } from 'modules/repository/asset.repository';
import { DatasheetServiceModule } from 'modules/services/datasheet/datasheet.service.module';
import { AttachmentField, AutoNumberField, CheckboxField, CreatedByField, CreatedTimeField, CurrencyField, DateTimeField, EmailField, FormulaField, LastModifiedByField, LastModifiedTimeField, LinkField, LookUpField, MemberField, MultiSelectField, NumberField, PercentField, PhoneField, RatingField, SingleSelectField, TextField, UrlField } from 'fusion/field';
import { SingleTextField } from 'fusion/field/single.text.field';
import { UnitServiceModule } from 'modules/services/unit/unit.service.module';

@Module({
  imports: [TypeOrmModule.forFeature([AssetRepository]), UnitServiceModule, DatasheetServiceModule],
  providers: [
    AttachmentField,
    AutoNumberField,
    CheckboxField,
    CreatedByField,
    CreatedTimeField,
    CurrencyField,
    DateTimeField,
    EmailField,
    FormulaField,
    LastModifiedByField,
    LastModifiedTimeField,
    LinkField,
    LookUpField,
    MemberField,
    MultiSelectField,
    NumberField,
    PercentField,
    PhoneField,
    RatingField,
    SingleSelectField,
    SingleTextField,
    TextField,
    UrlField,
  ],
  exports: [
    AttachmentField,
    AutoNumberField,
    CheckboxField,
    CreatedByField,
    CreatedTimeField,
    CurrencyField,
    DateTimeField,
    EmailField,
    FormulaField,
    LastModifiedByField,
    LastModifiedTimeField,
    LinkField,
    LookUpField,
    MemberField,
    MultiSelectField,
    NumberField,
    PercentField,
    PhoneField,
    RatingField,
    SingleSelectField,
    SingleTextField,
    TextField,
    UrlField,
  ],
})
export class FieldModule {}
