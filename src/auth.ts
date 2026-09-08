export type Role = "admin" | "user";

export interface Account {
  email: string;
  password: string;
  role: Role;
}

export interface Session {
  email: string;
  role: Role;
}

const ACCOUNTS_KEY = "orbt-accounts";
const SESSION_KEY = "orbt-session";

const DEFAULT_ACCOUNTS: Account[] = [
  { email: "admin@orbt.com", password: "admin123", role: "admin" },
  { email: "user@orbt.com", password: "user123", role: "user" },
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

export function login(
  role: Role,
  email: string,
  password: string
): { session?: Session; error?: string } {
  const accounts = getAccounts();
  const match = accounts.find(
    (a) => a.email.toLowerCase() === email.toLowerCase() && a.role === role
  );
  if (!match) return { error: `No ${role} account with that email.` };
  if (match.password !== password) return { error: "Wrong password." };

  const session: Session = { email: match.email, role: match.role };
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