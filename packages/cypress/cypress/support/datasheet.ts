export enum FieldType {
  NotSupport = 0,
  Text = 1,
  Number = 2,
  SingleSelect = 3,
  MultiSelect = 4,
  DateTime = 5,
  Attachment = 6,
  Link = 7,
  URL = 8,
  Email = 9,
  Phone = 10,
  Checkbox = 11,
  Rating = 12,
  Member = 13,
  LookUp = 14,
  // RollUp = 15,
  Formula = 16,
  Currency = 17,
  Percent = 18,
  SingleText = 19,
  AutoNumber = 20,
  CreatedTime = 21,
  LastModifiedTime = 22,
  CreatedBy = 23,
  LastModifiedBy = 24,
}

export const datasheet = () => ({
  elements: {
    createFieldBtn: '#DATASHEET_ADD_COLUMN_BTN',
    fieldTypeSelect: '#DATASHEET_GRID_CUR_COLUMN_TYPE',
    dateItem: '.main > div:nrh-child(8)'
  },
  createField(fieldType: FieldType) {
    cy.get(this.elements.createFieldBtn).click();
    cy.get(this.elements.fieldTypeSelect).click();
    cy.get(this.elements.dateItem).click();
  }
})