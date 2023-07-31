import axios, { AxiosInstance } from 'axios';

class DataBusApi {
    private httpClient: AxiosInstance;

    constructor(baseURL: string, defaultHeaders?: Record<string, string>) {
      this.httpClient = axios.create({
        baseURL,
        headers: defaultHeaders,
      });
    }

    async get_datasheet_pack<T>(dstId: string): Promise<any> {
      try {
        const response = await this.httpClient.request<T>({
          url: `/datasheet_pack/${dstId}`,
          baseURL: this.httpClient.defaults.baseURL,
          method: 'GET'
        });
        return response.data;
      } catch (error) {
        console.log('error', error);
      }
    }

    async echo<T>(): Promise<any> {
      try {
        const response = await this.httpClient.request<T>({
          url: '/databus',
          baseURL: this.httpClient.defaults.baseURL,
          method: 'GET'
        });
        return response.data;
      } catch (error) {
        console.log('error', error);
      }
    }
}

export default DataBusApi;
