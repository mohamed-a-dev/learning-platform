export interface CreateUserForm {
    name: string;
    email: string;
    password: string;
    role: string;
    gender:string;
}

export interface EditUserForm {
    name: string;
    password: string;
    passwordConfirmation: string;
}

export interface UpdateUserData {
    name: string;
    password: string;
}