import axios from 'axios';
import { IBatchSignatureResponse } from 'helper/assert_signature_manager/interface';

export const batchSignature = async(strings: string[]) => {
  const res = await axios.post<IBatchSignatureResponse>('/asset/signatures', {
    resourceKeys: strings,
  });

  const { data, success, message } = res.data;

  if (success) {
    return data;
  }

  throw new Error(message);
};
