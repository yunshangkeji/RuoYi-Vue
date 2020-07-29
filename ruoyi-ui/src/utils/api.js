import request from "@/utils/request";

export function api(sPath, mData) {
  if (mData === undefined) {
    mData = {}
  }
  const aPath = sPath.split('/');
  const sCategory = aPath[0];
  const aPath1 = aPath[1].split(':');
  const sObject = aPath1[0];
  const option = {};
  option.url = "/admin/" + sCategory + "/" + sObject;
  if (aPath1[1]) {
    option.method = aPath1[1];
  }
  option.data = mData;
  return request(option);
}
