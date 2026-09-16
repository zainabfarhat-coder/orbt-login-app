export type Role = "admin" | "user";

export interface Account {
  id: string;
  email: string;
  password: string;
  role: Role;
}

export interface Session {
  id: string;
  email: string;
  role: Role;
}

const ACCOUNTS_KEY = "orbt-accounts";
const SESSION_KEY = "orbt-session";
const USER_IDS_KEY = "orbt-user-ids"; // maps email -> id, for open "user" logins

const DEFAULT_ACCOUNTS: Account[] = [
  { id: "admin-1", email: "admin@orbt.com", password: "admin123", role: "admin" },
];

export function ensureAccounts(): void {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  if (!raw) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
  }
}

export function getAccounts(): Account[] {
  const raw = localStorage.getItem(ACCOUNTS_KEY);
  return raw ? JSON.parse(raw) : DEFAULT_ACCOUNTS;
}

function getUserIdMap(): Record<string, string> {
  const raw = localStorage.getItem(USER_IDS_KEY);
  return raw ? JSON.parse(raw) : {};
}


function getOrCreateUserId(email: string): string {
  const map = getUserIdMap();
  const key = email.toLowerCase();
  if (map[key]) return map[key];
  const newId = `user-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
  map[key] = newId;
  localStorage.setItem(USER_IDS_KEY, JSON.stringify(map));
  return newId;
}

export function login(
  role: Role,
  email: string,
  password: string
): { session?: Session; error?: string } {
  
  if (role === "user") {
    if (!email || !password) return { error: "Enter an email and password." };
    const id = getOrCreateUserId(email);
    const session: Session = { id, email, role: "user" };
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    return { session };
  }

  const accounts = getAccounts();
  const match = accounts.find(
    (a) => a.email.toLowerCase() === email.toLowerCase() && a.role === role
  );
  if (!match) return { error: `No ${role} account with that email.` };
  if (match.password !== password) return { error: "Wrong password." };

  const session: Session = { id: match.id, email: match.email, role: match.role };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  return { session };
}

export function getSession(): Session | null {
  const raw = localStorage.getItem(SESSION_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function logout(): void {
  localStorage.removeItem(SESSION_KEY);
}


export function getEmailById(id: string): string {
  const accounts = getAccounts();
  const acc = accounts.find((a) => a.id === id);
  if (acc) return acc.email;

  const map = getUserIdMap();
  for (const [email, mappedId] of Object.entries(map)) {
    if (mappedId === id) return email;
  }
  return id;
}