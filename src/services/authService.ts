import type { User, LoginCredentials, RegisterData, AuthResponse } from '../types/auth';

const STORAGE_KEY = 'varecvsce_users';
const SESSION_KEY = 'varecvsce_session';
const TOKEN_KEY = 'varecvsce_token';

function generateId(): string {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function generateToken(userId: string): string {
  return btoa(`${userId}:${Date.now()}:${Math.random().toString(36)}`);
}

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

function getUsers(): User[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User[]) : [];
  } catch {
    return [];
  }
}

function saveUsers(users: User[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

function getPasswords(): Record<string, string> {
  try {
    const raw = localStorage.getItem('varecvsce_passwords');
    return raw ? (JSON.parse(raw) as Record<string, string>) : {};
  } catch {
    return {};
  }
}

function savePasswords(passwords: Record<string, string>): void {
  localStorage.setItem('varecvsce_passwords', JSON.stringify(passwords));
}

function seedDefaultUsers(): void {
  const users = getUsers();
  if (users.length > 0) return;

  const adminId = generateId();
  const userId = generateId();

  const defaultUsers: User[] = [
    {
      id: adminId,
      username: 'admin',
      email: 'admin@varecvsce.com',
      fullName: 'Administrator',
      createdAt: new Date().toISOString(),
      role: 'admin',
    },
    {
      id: userId,
      username: 'testuser',
      email: 'user@varecvsce.com',
      fullName: 'Test User',
      createdAt: new Date().toISOString(),
      role: 'user',
    },
  ];

  const passwords: Record<string, string> = {
    [adminId]: hashPassword('admin123'),
    [userId]: hashPassword('user123'),
  };

  saveUsers(defaultUsers);
  savePasswords(passwords);
}

export const authService = {
  init(): void {
    seedDefaultUsers();
  },

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 600));

    const users = getUsers();
    const passwords = getPasswords();

    const user = users.find(
      (u) => u.email.toLowerCase() === credentials.email.toLowerCase()
    );

    if (!user) {
      return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }

    const storedHash = passwords[user.id];
    const inputHash = hashPassword(credentials.password);

    if (storedHash !== inputHash) {
      return { success: false, message: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' };
    }

    const token = generateToken(user.id);
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    localStorage.setItem(TOKEN_KEY, token);

    return { success: true, message: 'تم تسجيل الدخول بنجاح', user, token };
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 700));

    const users = getUsers();

    const emailExists = users.some(
      (u) => u.email.toLowerCase() === data.email.toLowerCase()
    );
    if (emailExists) {
      return { success: false, message: 'البريد الإلكتروني مستخدم بالفعل' };
    }

    const usernameExists = users.some(
      (u) => u.username.toLowerCase() === data.username.toLowerCase()
    );
    if (usernameExists) {
      return { success: false, message: 'اسم المستخدم مستخدم بالفعل' };
    }

    if (data.password.length < 6) {
      return { success: false, message: 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' };
    }

    const newUser: User = {
      id: generateId(),
      username: data.username,
      email: data.email,
      fullName: data.fullName,
      createdAt: new Date().toISOString(),
      role: 'user',
    };

    const passwords = getPasswords();
    passwords[newUser.id] = hashPassword(data.password);

    users.push(newUser);
    saveUsers(users);
    savePasswords(passwords);

    const token = generateToken(newUser.id);
    localStorage.setItem(SESSION_KEY, JSON.stringify(newUser));
    localStorage.setItem(TOKEN_KEY, token);

    return { success: true, message: 'تم إنشاء الحساب بنجاح', user: newUser, token };
  },

  logout(): void {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
  },

  getSession(): User | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem(TOKEN_KEY);
  },

  isAuthenticated(): boolean {
    return !!this.getSession() && !!this.getToken();
  },

  async updateProfile(userId: string, updates: Partial<Pick<User, 'fullName' | 'username'>>): Promise<AuthResponse> {
    await new Promise((resolve) => setTimeout(resolve, 400));

    const users = getUsers();
    const index = users.findIndex((u) => u.id === userId);

    if (index === -1) {
      return { success: false, message: 'المستخدم غير موجود' };
    }

    if (updates.username) {
      const taken = users.some((u) => u.username.toLowerCase() === updates.username?.toLowerCase() && u.id !== userId);
      if (taken) {
        return { success: false, message: 'اسم المستخدم مستخدم بالفعل' };
      }
    }

    users[index] = { ...users[index], ...updates };
    saveUsers(users);
    localStorage.setItem(SESSION_KEY, JSON.stringify(users[index]));

    return { success: true, message: 'تم تحديث الملف الشخصي بنجاح', user: users[index] };
  },
};
