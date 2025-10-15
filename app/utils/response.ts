export class ApiResponse {
	static success(data: any, message?: string) {
		return {
			success: true,
			message: message || 'request successful',
			data,
			timestamp: new Date().toISOString(),
		}
	}
	
	static error(message: string, code: number | 500, details?: any) {
		return {
			success: false,
			error: message || 'request failed',
			code,
			details,
			timestamp: new Date().toISOString(),
		}
	}
	
	static paginated(data: any[], page: number, limit: number, total: number) {
		return {
			success: true,
			data: data,
			pagination: {
				page,
				limit,
				total,
				totalPage: Math.ceil(total / page),
				hasNextPage: page * limit < total,
				hasPreviousPage: page > 1
			},
			timestamp: new Date().toISOString(),
		}
	}
}