export type OrderStatus = "pending" | "approved" | "rejected";

export interface Order {
  id: string;
  brandName: string;
  price: number;
  quantity: number;
  total: number;
  date: string;
  status: OrderStatus;
}

const ORDERS_PREFIX = "orbt-orders-";

function ordersKey(email: string): string {
  return `${ORDERS_PREFIX}${email.toLowerCase()}`;
}

const DEFAULT_ORDERS: Order[] = [
  { id: "1", brandName: "Nike", price: 45, quantity: 2, total: 90, date: "2026-08-01", status: "pending" },
  { id: "2", brandName: "Adidas", price: 60, quantity: 1, total: 60, date: "2026-08-15", status: "approved" },
  { id: "3", brandName: "Puma", price: 30, quantity: 3, total: 90, date: "2026-09-01", status: "pending" },
];

export function ensureOrders(email: string): void {
  const key = ordersKey(email);
  const raw = localStorage.getItem(key);
  if (!raw) {
    localStorage.setItem(key, JSON.stringify(DEFAULT_ORDERS));
  }
}

export function getOrders(email: string): Order[] {
  const raw = localStorage.getItem(ordersKey(email));
  return raw ? JSON.parse(raw) : DEFAULT_ORDERS;
}

export function addOrder(
  email: string,
  brandName: string,
  price: number,
  quantity: number
): Order {
  const orders = getOrders(email);
  const newOrder: Order = {
    id: Date.now().toString(),
    brandName,
    price,
    quantity,
    total: price * quantity,
    date: new Date().toISOString().split("T")[0],
    status: "pending",
  };
  const updated = [...orders, newOrder];
  localStorage.setItem(ordersKey(email), JSON.stringify(updated));
  return newOrder;
}

export function getOrderById(email: string, id: string): Order | undefined {
  return getOrders(email).find((o) => o.id === id);
}

// ---- Admin helpers: read/update orders across ALL users ----

export interface OrderWithOwner extends Order {
  ownerEmail: string;
  ownerId: string;
}

export function getAllOrders(): OrderWithOwner[] {
  const all: OrderWithOwner[] = [];
  const idMapRaw = localStorage.getItem("orbt-user-ids");
  const idMap: Record<string, string> = idMapRaw ? JSON.parse(idMapRaw) : {};

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(ORDERS_PREFIX)) continue;
    const email = key.slice(ORDERS_PREFIX.length);
    const raw = localStorage.getItem(key);
    if (!raw) continue;
    const orders: Order[] = JSON.parse(raw);
    const ownerId = idMap[email] || email;
    orders.forEach((o) => all.push({ ...o, ownerEmail: email, ownerId }));
  }
  return all.sort((a, b) => b.id.localeCompare(a.id));
}

export function updateOrderStatus(
  ownerEmail: string,
  orderId: string,
  status: OrderStatus
): void {
  const key = ordersKey(ownerEmail);
  const raw = localStorage.getItem(key);
  if (!raw) return;
  const orders: Order[] = JSON.parse(raw);
  const updated = orders.map((o) => (o.id === orderId ? { ...o, status } : o));
  localStorage.setItem(key, JSON.stringify(updated));
}