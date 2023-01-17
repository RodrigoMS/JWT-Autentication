import baseAPI from "./config";

interface LoginPayload {
    email: string,
    password: string
}

export function login(payload: LoginPayload) {
    return baseAPI.post("/news-api/v1/login", payload)
}