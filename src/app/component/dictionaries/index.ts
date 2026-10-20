// import 'server-only';
// import APICONSTANT, { APIURLS } from '@/services/config';
import FalbackTranslate from './fallback_translate.json';
// const dictionaries: {[key: string]: () => Promise<{ [key: string]: { [key: string]: string } }> } = {
//   en: () => import("./intl/en.json").then((module) => module.default),
//   nl: () => import("./intl/nl.json").then((module) => module.default),
// };

export const getDictionary = async (locale: any) => {
  try {
    const lang = locale || 'en'; //cookie value
    // console.log('lang',lang)
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/public/locale/${lang}.json`).then((res) => res.json());
  // console.log('response',response)
  return response;
  // return {...FalbackTranslate, ...response};
  // return FalbackTranslate;
} catch(err) {
  console.log('langerror___', err);
  return FalbackTranslate;
}
};
