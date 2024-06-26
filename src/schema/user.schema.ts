import { TypeOf, object, string } from 'zod';

export const createUserSchema = object({
    body: object({
        username: string({
            required_error: "Username is required"
        }),
        email: string({
            required_error: "Email is required"
        }).email("Not a valid email address"),
        password: string({
            required_error: "Password is required"
        }).min(6, "Password too short")
    })
})


export type CreateUserInput = TypeOf<typeof createUserSchema>;