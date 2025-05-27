export interface LoginDTO {
    email: string;
    password: string;
}

export interface LoginResponseDTO {
    token: string;
    refreshToken: string;
    // Additional user information can be added here as per API documentation
}
