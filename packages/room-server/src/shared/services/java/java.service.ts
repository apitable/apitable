import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { IAuthHeader } from '../../interfaces';

/**
 * @deprecated deprecated, use RestService instead.
 */
@Injectable()
export class JavaService {
  public static readonly SUCCESS_CODE = 200;
  private headers: any;
  constructor(private readonly httpService: HttpService) {}

  private getHeaders() {
    return {
      ...(this.headers || {}),
      'X-Internal-Request':'yes',
    };
  }
  public async post(url: string, data: any, options?: any): Promise<any> {
    const response = await this.httpService.post(url, data, {
      headers: this.getHeaders(), ...options }).toPromise();
    return response.data;
  }

  public async get(url: string, params?: any, options?: any): Promise<any> {
    const response = await this.httpService.get(url, { params, headers: this.getHeaders(), ...options }).toPromise();
    return response.data;
  }
  /**
   *
   * @param auth verfication
   * @param options other header parameters
   * @return
   * @author Zoe Zheng
   * @date 2020/8/12 10:53 AM
   */
  public setHeaders(auth: IAuthHeader, options?: any): this {
    if (auth.cookie) {
      this.headers = {
        Cookie: auth.cookie,
        ...options,
      };
    }
    if (auth.token) {
      this.headers = {
        Authorization: auth.token,
        ...options,
      };
    }
    return this;
  }
}
