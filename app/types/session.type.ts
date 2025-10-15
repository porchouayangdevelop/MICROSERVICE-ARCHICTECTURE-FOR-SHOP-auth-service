export interface Sessions {
	id: number;
	userId: number;
	refresh_token: string;
	ipAddress: string;
	userAgent: string;
	expiresAt?: Date | null;
	createdAt?: Date | null;
}