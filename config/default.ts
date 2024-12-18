import dotenv from 'dotenv';
import { loadVariables } from 'apitoolz';
import { values } from 'lodash';

dotenv.config();

const DEPLOYMENT_MODE = {
    DEV: 'development',
    PROD: 'production',
    TEST: 'test',
};

const NODE_ENV = process.env.NODE_ENV || DEPLOYMENT_MODE.DEV;

const currentDeployment = {
    isDev: NODE_ENV == DEPLOYMENT_MODE.DEV,
    isProduction: NODE_ENV == DEPLOYMENT_MODE.PROD,
    isTest: NODE_ENV == DEPLOYMENT_MODE.TEST,
};

const constants = loadVariables(
    {
        PORT: {
            required: currentDeployment.isProduction,
            default: () => (currentDeployment.isTest ? 80 : 5001),
            parser: (value: number) => (currentDeployment.isTest ? 0 : value)
        },

        MONGODB_URI: {
            required: !currentDeployment.isTest,
            default: ""
        },

        SALT_WORK_FACTOR: {
            required: !currentDeployment.isTest,
            default: 10,
            parser: (value: number) => (currentDeployment.isDev ? 10 : Number(value))
        },

        PUBLIC_KEY: {
            required: !currentDeployment.isTest,
            default: "",
            parser: (value: string) => (currentDeployment.isTest ? value : value)
        },

        PRIVATE_KEY: {
            required: !currentDeployment.isTest,
            default: "",
            parser: (value: string) => (currentDeployment.isTest ? value : value)
        },

        ACCESS_TOKEN_TTL: {
            required: !currentDeployment.isTest,
            default: '15m',
            parser: (value: string) => (currentDeployment.isDev ? '15m' : value)
        },

        REFRESH_TOKEN_TTL: {
            required: !currentDeployment.isTest,
            default: '1y',
            parser: (value: string) => (currentDeployment.isDev ? '1y' : value)
        },

        VTU_API_KEY: {
            required: !currentDeployment.isTest,
            default: ""
        },

        VTU_PK: {
            required: !currentDeployment.isTest,
            default: ""
        },
        VTU_SK: {
            required: !currentDeployment.isTest,
            default: ""
        },
        BASE_URL: {
            required: !currentDeployment.isTest,
            default: ""
        },
        PAYSTACK_SECRET_KEY: {
            required: !currentDeployment.isTest,
            default: ""
        },
        PAYSTACK_BASE_URL: {
            required: !currentDeployment.isTest,
            default: ""
        },
    }
)

export const config = {
    port: constants.PORT,
    db: {
        dbURI: constants.MONGODB_URI!
    },
    saltWorkFactor: constants.SALT_WORK_FACTOR,
    publicKey: constants.PUBLIC_KEY,
    privateKey: constants.PRIVATE_KEY,
    accessTokenTtl: constants.ACCESS_TOKEN_TTL,
    refreshTokenTtl: constants.REFRESH_TOKEN_TTL,
    vtuApiKey: constants.VTU_API_KEY,
    vtuSecretKey: constants.VTU_SK,
    vtuPrivateKey: constants.VTU_PK,
    baseUrl: constants.BASE_URL,
    paystackSecretKey: constants.PAYSTACK_SECRET_KEY,
    paystackBaseUrl: constants.PAYSTACK_BASE_URL

}

export default config;