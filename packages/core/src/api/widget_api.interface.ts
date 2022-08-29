export interface IWidgetTemplateItem {
  cover: string;
  description: string;
  icon: string;
  name: string;
  releaseCodeBundle: string;
  sourceCodeBundle: string;
  version: string;
  widgetPackageId: string;
  extras: { [key: string]: any };
}