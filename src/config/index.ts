export default {
  baseUrl: 'https://dy.ttentau.top/imgs/',
  imgPath: '/imgs/',
  filePreview: 'http://192.168.0.103/static/uploads/'
}
const BASE_URL_MAP: { [key: string]: string } = {
  development: '',
  production: '',
  // GP_PAGES: '/dist',
  GP_PAGES: '',
  GITEE_PAGES: '/douyin',
  UNI: 'https://dy.ttentau.top'
}

const env = process.env.NODE_ENV as string;

console.log(env, 'envenvenvenv')
export const IS_SUB_DOMAIN = ['GITEE_PAGES', 'GP_PAGES'].includes(env)
export const IS_GITEE_PAGES = ['GITEE_PAGES'].includes(env)
export const BASE_URL = BASE_URL_MAP[env]
export const IMG_URL = BASE_URL + '/images/'
export const FILE_URL = BASE_URL + '/data/'
export const IS_DEV = env !== 'production'
