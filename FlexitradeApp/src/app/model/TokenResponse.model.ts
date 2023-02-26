import { Role } from "./Role.model";

export interface TokenResponse {
    accessToken: String;
    type: String;
    refreshToken: string;
    id: Number;
    username: String;
    email: String
    roles: Set<Role>;
}
