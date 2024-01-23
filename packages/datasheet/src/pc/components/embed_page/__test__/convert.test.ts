import { convertBilibiliUrl, convertFigmaUrl, convertYoutubeUrl } from '../utils/convert-url';

describe('youtube url convert', () => {
  test('The link copied directly from the URL.', () => {
    const url = 'https://www.youtube.com/watch?v=zbYf5_S7oJo';
    const afterConvert = convertYoutubeUrl(url);

    expect(afterConvert).toBe('https://www.youtube.com/embed/zbYf5_S7oJo');
  });

  test('The link copied from the share button.', () => {
    const url = 'https://youtu.be/zbYf5_S7oJo?si=mqrX0JJaqUjo3bSV';
    const afterConvert = convertYoutubeUrl(url);

    expect(afterConvert).toBe('https://www.youtube.com/embed/zbYf5_S7oJo');
  });

  test('The link copied from the embed button.', () => {
    const url = 'https://www.youtube.com/embed/zbYf5_S7oJo?si=mqrX0JJaqUjo3bSV';
    const afterConvert = convertYoutubeUrl(url);

    expect(afterConvert).toBe('https://www.youtube.com/embed/zbYf5_S7oJo');
  });
});

describe('figma url convert', () => {
  test('The link copied directly from the URL.', () => {
    const url = 'https://www.figma.com/file/VhZDEoWkElBsboE85XKShv/%E3%80%90%E5%B7%A5%E4%BD%9C%E5%8F%B0%E3%80%91%E5%B5%8C%E5%85%A5-URL-%E8%8A%82%E7%82%B9?type=design&node-id=0-1&mode=design&t=P2gz6pps5mdQqRA3-0';
    const afterConvert = convertFigmaUrl(url);

    expect(afterConvert).toBe('https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FVhZDEoWkElBsboE85XKShv%2F%25E3%2580%2590%25E5%25B7%25A5%25E4%25BD%259C%25E5%258F%25B0%25E3%2580%2591%25E5%25B5%258C%25E5%2585%25A5-URL-%25E8%258A%2582%25E7%2582%25B9%3Ftype%3Ddesign%26node-id%3D0-1%26mode%3Ddesign%26t%3DP2gz6pps5mdQqRA3-0');
  });

  test('The link copied from the embed', () => {
    const url = 'https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FVhZDEoWkElBsboE85XKShv%2F%25E3%2580%2590%25E5%25B7%25A5%25E4%25BD%259C%25E5%258F%25B0%25E3%2580%2591%25E5%25B5%258C%25E5%2585%25A5-URL-%25E8%258A%2582%25E7%2582%25B9%3Ftype%3Ddesign%26node-id%3D0-1%26mode%3Ddesign%26t%3DP2gz6pps5mdQqRA3-0';
    const afterConvert = convertFigmaUrl(url);

    expect(afterConvert).toBe('https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Ffile%2FVhZDEoWkElBsboE85XKShv%2F%25E3%2580%2590%25E5%25B7%25A5%25E4%25BD%259C%25E5%258F%25B0%25E3%2580%2591%25E5%25B5%258C%25E5%2585%25A5-URL-%25E8%258A%2582%25E7%2582%25B9%3Ftype%3Ddesign%26node-id%3D0-1%26mode%3Ddesign%26t%3DP2gz6pps5mdQqRA3-0');
  });
});

describe('bilibili url convert', () => {
  test('The link copied directly from the URL.', () => {
    const url = 'https://www.bilibili.com/video/BV123456/?spm_id_from=333.999.0.0&vd_source=673e8ff87cf3ab66b5fe961965fb198d';
    const afterConvert = convertBilibiliUrl(url);

    expect(afterConvert).toBe('https://player.bilibili.com/player.html?bvid=BV123456');
  });

  test('The link copied from the embed', () => {
    const url = 'https://player.bilibili.com/player.html?bvid=BV123456';
    const afterConvert = convertBilibiliUrl(url);

    expect(afterConvert).toBe('https://player.bilibili.com/player.html?bvid=BV123456');
  });
});
