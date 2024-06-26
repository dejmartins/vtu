import { Request, Response } from "express";
import log from "../utils/logger";
import { omit } from "lodash";
import { createUser } from "../services/user.service";
import { CreateUserInput } from "schema/user.schema";

export async function createUserHandler(req: Request<{}, {}, CreateUserInput['body']>, res: Response) {
    try{
        const user = await createUser(req.body);
        return res.send(omit(user, "password"));
    } catch (e: any) {
        log.error(e);
        return res.status(409).send(e.message);
    }
}