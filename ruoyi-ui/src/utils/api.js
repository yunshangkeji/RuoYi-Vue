import request from "@/utils/request";

export function api(sPath, mData) {
  const aPath = sPath.split('/');
  const sCategory = aPath[0];
  const aPath1 = aPath[1].split(':');
  const sObject = aPath1[0];
  const sMethod = aPath1[1];
  const option = {};
  option.url = "/admin/" + sCategory + "/" + sObject;
  option.method = sMethod;
  option.data = mData;
  return request(option);
}
