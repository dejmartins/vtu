import supertest from "supertest"
import createServer from "../utils/server"
import { signJwt } from "../utils/jwt";
import { dbConnect, dbDisconnect } from "./utils/dbHandler";
import { purchaseAirtimePayload, userPayload } from "./utils/fixtures";
import * as AirtimeService from "../services/airtime.service"

const app = createServer();

describe('airtime', () => {
    beforeAll(async () => {
        dbConnect();
      });
    
      afterAll(async () => {
        dbDisconnect();
      });

    describe('buy airtime route', () => {
        describe('given the user is not logged in', () => {
            it('should return a 403', async () => {
                const { statusCode } = await supertest(app)
                    .post('/api/airtime');

                expect(statusCode).toBe(403);
            })
        })

        describe('given the user is logged in', () => {
            it('should purchase airtime successfully and returns 200', async () => {
                const jwt = signJwt(userPayload);

                const { body, statusCode } = await supertest(app)
                    .post('/api/airtime')
                    .set('Authorization', `Bearer ${jwt}`)
                    .send(purchaseAirtimePayload)

                expect(statusCode).toBe(200);

                expect(body).toHaveProperty('_id')
            })
        })

        describe('given the vtu api service is down', () => {
            it('should return an error 503', async () => {
                const createAirtimePurchaseMock = jest.spyOn(AirtimeService, 'purchaseAirtimeProduct')
                .mockRejectedValueOnce("Service Unavailable");

                const jwt = signJwt(userPayload);

                const { statusCode } = await supertest(app)
                    .post('/api/airtime')
                    .set('Authorization', `Bearer ${jwt}`)
                    .send(purchaseAirtimePayload)

                expect(statusCode).toBe(503);

                expect(createAirtimePurchaseMock).toHaveBeenCalled();
            })
        })
    })
})