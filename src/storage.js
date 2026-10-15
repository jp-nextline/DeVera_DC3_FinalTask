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