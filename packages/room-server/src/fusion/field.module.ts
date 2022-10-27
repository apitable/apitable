import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssetRepository } from '../database/repositories/asset.repository';
import { DatasheetServiceModule } from '../database/_modules/datasheet.service.module';
import { AttachmentField, AutoNumberField, CheckboxField, CreatedByField, CreatedTimeField, CurrencyField, DateTimeField, EmailField, FormulaField, LastModifiedByField, LastModifiedTimeField, LinkField, LookUpField, MemberField, MultiSelectField, NumberField, PercentField, PhoneField, RatingField, SingleSelectField, TextField, UrlField } from 'fusion/field';
import { SingleTextField } from 'fusion/field/single.text.field';
import { UnitServiceModule } from '../database/_modules/unit.service.module';

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
