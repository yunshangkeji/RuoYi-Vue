
export function setting_set(setting) {
  for (var key in setting) {
    localStorage.setItem(key, setting[key])
  }
}

export function setting_common_put(data) {
  const len = localStorage.length
  for (var i = 0; i < len; i++) {
    const key = localStorage.key(i)
    if (key.indexOf('common_') !== 0) {
      continue
    }
    data[key] = localStorage.getItem(key);
  }
}

export function setting_get(key) {
  return localStorage.getItem(key);
}

export function setting_del(key) {
  localStorage.removeItem(key);
}

