export interface LoginDTO {
    email: string;
    password: string;
}

export interface LoginResponseDTO {
    token: string;
    refreshToken: string;
    userId?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    role?: string;
    isEmailConfirmed?: boolean;
}
