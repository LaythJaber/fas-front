export interface AuthResponse {
  token: string;
  status: 'PENDING' | 'DONE' | 'PENDING_SUPER_ADMIN';
  switchedLicense: boolean;
}
