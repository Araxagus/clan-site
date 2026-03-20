export interface UserWithStatus {
  id: string;
  name: string | null;
  email: string | null;
  role: "USER" | "MOD" | "ADMIN";
  status: "active" | "pending" | "banned";
  isApproved: boolean;
  createdAt: Date;
}
