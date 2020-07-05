import request from "@/utils/request";

export function api(category, object, method, data) {
  const option = {};
  option.url = "/admin/" + category + "/" + object;
  option.method = method;
  option.data = data;
  return request(option);
}
