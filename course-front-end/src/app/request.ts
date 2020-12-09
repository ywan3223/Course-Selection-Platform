import { getSignature } from './localstorage';

const baseUrl = 'http://localhost:3000';
export function request(
  url: string,
  config: any,
  auth: boolean = true
): Promise<any> {
  const completeUrl = baseUrl + url;
  config.headers = Object.assign(
    {},
    {
      'content-type': 'application/json',
    }
  );
  const signature = getSignature();
  if (auth && signature) {
    config.headers.Authorization = 'Bearer ' + signature;
  }
  return new Promise((resolve, reject) => {
    fetch(completeUrl, config)
      .then((res) => {
        return res.json();
      })
      .then((res) => {
        if (config.method !== 'GET') {
          alert(res.msg);
        }
        resolve(res);
      })
      .catch((err) => {
        reject(err);
      });
  });
}
