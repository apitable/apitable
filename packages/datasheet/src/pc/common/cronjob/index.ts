import { fixData } from './jobs';

type IJob = [(store) => void, number];

const jobs: IJob[] = [
  [fixData, 300],
  // [uploadError, 10000],  FIXME: 取消 Missing RecordData 的上报。
];

export const initCronjobs = (store) => {
  jobs.forEach((jobItem: IJob) => {
    const [job, delay] = jobItem;
    setInterval(() => job(store), delay);
  });
};