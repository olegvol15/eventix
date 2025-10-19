// единый "канонический" ключ
const PRIMARY_KEY = 'cart:v1';
// совместимость со старыми/другими ключами
const LEGACY_KEYS = ['cart_v1', 'cart_items_v1'];

function safeParse(raw) {
  if (!raw) return [];
  try {
    const v = JSON.parse(raw);
    // если кто-то положил один объект, оборачиваем его в массив
    if (Array.isArray(v)) return v;
    if (v && typeof v === 'object') return [v];
    return [];
  } catch {
    return [];
  }
}

export function loadCart() {
  // читаем всё, что можем
  const primary = safeParse(localStorage.getItem(PRIMARY_KEY));
  if (primary.length) return primary;

  for (const k of LEGACY_KEYS) {
    const legacy = safeParse(localStorage.getItem(k));
    if (legacy.length) {
      // мигрируем и чистим старый ключ
      localStorage.setItem(PRIMARY_KEY, JSON.stringify(legacy));
      localStorage.removeItem(k);
      return legacy;
    }
  }
  return [];
}

export function saveCart(items) {
  const arr = Array.isArray(items) ? items : [];
  localStorage.setItem(PRIMARY_KEY, JSON.stringify(arr));
  // подчистим наследие
  LEGACY_KEYS.forEach(k => localStorage.removeItem(k));
}

export function addToCart(item) {
  const items = loadCart();
  // убираем дубль по reservationId (если есть)
  const filtered = item?.reservationId
    ? items.filter(x => x.reservationId !== item.reservationId)
    : items;
  filtered.push(item);
  saveCart(filtered);
  return filtered;
}

export function clearCart() {
  saveCart([]);
}

export function removeFromCart(reservationId) {
  const items = loadCart().filter(i => i.reservationId !== reservationId);
  saveCart(items);
  return items;
}
