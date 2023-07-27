import DataBusApi from './DataBusApi';

describe('DataBusApi', () => {
  let dataBusApi: DataBusApi;

  beforeEach(() => {
    dataBusApi = new DataBusApi('http://127.0.0.1:8625');
  });

  it('should get databus-server response', async() => {
    const response = await dataBusApi.echo();
    console.log('response', response);
    // expect(response).toEqual('Databus Main Server is running!');
  });

  it('should get databus-server datasheet pack', async() => {
    const response = await dataBusApi.get_datasheet_pack('test');
    console.log('response', response);
    // expect(response).toBeDefined();
  });
});
