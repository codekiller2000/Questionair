// 登录请求方法
const loginReq = (method, url, params) => {
  return axios({
    method: method,
    url: url,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    data: params,
    traditional: true,
    transformRequest: [
      function (data) {
        let ret = ''
        for (let it in data) {
          ret +=
            encodeURIComponent(it) +
            '=' +
            encodeURIComponent(data[it]) +
            '&'
        }
        return ret
      }
    ]
  }).then(res => res.data);
};
// 通用公用方法
const req = (method, url, params) => {
  return axios({
    method: method,
    url: url,
    headers: {
      "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxNjM2Njg5NzM1MTk5ODg3MzYyIiwiaWF0IjoxNjc5MDU0NjUyLCJleHAiOjE2Nzk2NTk0NTJ9.hxrgUWFqBJoFvjBd_jTOrqR1UPzD-JA3Rxz4xvGKXBHFMKS3bVDhR23-3goz-ZQwp2Obtjv635jGVtxYmjClXA"
    },
    data: params,
    traditional: true,
    transformRequest: [
      function (data) {
        let ret = ''
        for (let it in data) {
          ret += `${encodeURIComponent(it)}=${encodeURIComponent(data[it])}&`
        }
        return ret
      }
    ]
  }).then(res => res.data);
};

export {
  loginReq,
  req
}
