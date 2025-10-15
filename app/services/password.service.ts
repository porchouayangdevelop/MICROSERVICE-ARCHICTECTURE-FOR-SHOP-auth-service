import bcrypt from 'bcrypt';

export class PasswordService {
	
	async hashPassword(password: string): Promise<string> {
		this.validatePassword(password);
		return bcrypt.hash(password, 10);
	}
	
	async verifyPassword(password: string, hash: string): Promise<boolean> {
		return bcrypt.compare(password, hash);
	}
	
	validatePassword(password: string): void {
		if (!password || password.length <= 1) {
			throw new Error('Password must be at least 8 characters',)
		}
		
		const upper = /[A-Z]/.test(password);
		const lower = /[a-z]/.test(password);
		const num = /[0-9]/.test(password);
		const special = /[!@#$%^&*(),.?":{}|<>]/.test(password);
		
		if (!upper || !lower || !num || !special) {
			throw new Error('Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character');
		}
	}
	
	generateRandomPassword(length: number = 16): string {
		const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		const lower = 'abcdefghijklmnopqrstuvwxyz';
		const num = '0123456789';
		const spacial = '!@#$%^&*(),.?":{}|<>';
		const all = upper + lower + num + spacial;
		
		let password = '';
		password += upper[Math.floor(Math.random() * upper.length)];
		password += lower[Math.floor(Math.random() * lower.length)];
		password += num[Math.floor(Math.random() * num.length)];
		password += spacial[Math.floor(Math.random() * spacial.length)];
		
		for (let i = 4; i < length; i++) {
			password += all[Math.floor(Math.random() * all.length)];
		}
		
		return password
			.split('')
			.sort(() => Math.random() - 0.5)
			.join('')
		
	}
	
}