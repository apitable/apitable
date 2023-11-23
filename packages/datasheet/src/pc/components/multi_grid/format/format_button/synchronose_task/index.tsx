import { message } from 'antd';
import { Strings, t } from '@apitable/core';

export function runTask() {
  let running = false;

  async function start(task: () => Promise<any>) {
    if (running) {
      // TODO  check text works
      message.error(t(Strings.refresh_and_close_page_when_automation_queue));
      return;
    }
    running = true;
    try {
      await task();
    } catch (e) {
      // catch error
      message.error(t(Strings.button_execute_error));
      running = false;
    }
  }

  function finish() {
    running = false;
  }
  function getStatus() {
    return running;
  }
  return {
    start,

    getStatus,
    finish,
  };
}

const runTaskScheduler = runTask();

export { runTaskScheduler };
