import { IWidgetRenderStatus } from './interface';

interface IWidgetTask {
  widgetId: string;
  dispatchWidgetStatus: (widgetId: string, status: IWidgetRenderStatus) => void;
}

const WIDGET_RUN_TASK_MAX = 4;

/**
 * Manage the rendering applet task queue and limit the number of simultaneous rendering widget.
 * Rendering an widget represents a complete process: load iframe -> connect -> init data
 */
class WidgetRenderTask {
  private widgetWaitTask: IWidgetTask[] = [];
  private widgetRunTask: IWidgetTask[] = [];

  addWidgetTask = (widgetId: string, dispatchWidgetStatus: (widgetId: string, status: IWidgetRenderStatus) => void) => {
    if (this.widgetRunTask.length < WIDGET_RUN_TASK_MAX) {
      dispatchWidgetStatus(widgetId, IWidgetRenderStatus.Loading);
      this.widgetRunTask.push({ widgetId, dispatchWidgetStatus });
    } else {
      this.widgetWaitTask.push({ widgetId, dispatchWidgetStatus });
    }
  };

  nextWidgetRunTask = (id: string) => {
    const index = this.widgetRunTask.findIndex(({ widgetId }) => widgetId === id);
    if (index >= 0) {
      const endWidget = this.widgetRunTask[index];
      // end
      endWidget.dispatchWidgetStatus(endWidget.widgetId, IWidgetRenderStatus.Finish);
      console.log(endWidget.widgetId, ' loaded...');
      this.widgetRunTask.splice(index, 1);
    }
    const widget = this.widgetWaitTask.shift();
    if (widget) {
      // Start the next one.
      widget.dispatchWidgetStatus(widget.widgetId, IWidgetRenderStatus.Loading);
      this.widgetRunTask.push(widget);
    }
  };

  clearTask(widgetId?: string) {
    if (widgetId) {
      this.widgetRunTask = this.widgetRunTask.filter((task) => task.widgetId === widgetId);
      this.widgetWaitTask = this.widgetWaitTask.filter((task) => task.widgetId === widgetId);
      return;
    }
    this.widgetRunTask = [];
    this.widgetWaitTask = [];
  }
}

export const widgetRenderTask = new WidgetRenderTask();
