export function loadData(key) {
  const text = localStorage.getItem(key)
  if (text === null) {
    return []
  }
  return JSON.parse(text)
}

export function saveData(key, list) {
  localStorage.setItem(key, JSON.stringify(list))
}

export function loadObject(key, defaultValue) {
  const text = localStorage.getItem(key)
  if (text === null) {
    return defaultValue
  }
  return JSON.parse(text)
}

export function saveObject(key, object) {
  localStorage.setItem(key, JSON.stringify(object))
}