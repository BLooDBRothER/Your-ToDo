import { ReceiverConfig, SignatureError, VerifyRequest as qStashVR } from "@upstash/qstash/.";
import * as jose from "jose";

type VerifyRequest = Pick<qStashVR, "signature">

export async function verifySignature(req: VerifyRequest, keys: ReceiverConfig): Promise<boolean> {
    const isValid = await verifyWithKey(keys.currentSigningKey, req);
    if (isValid) {
        return true;
    }
    return verifyWithKey(keys.nextSigningKey, req);
}

async function verifyWithKey(key: string, req: VerifyRequest): Promise<boolean> {
    const jwt = await jose
        .jwtVerify(req.signature, new TextEncoder().encode(key), {
            issuer: "Upstash",
            clockTolerance: 0,
        })
        .catch((e) => {
            throw new SignatureError((e as Error).message);
        });

    const p = jwt.payload as {
        iss: string;
        sub: string;
        exp: number;
        nbf: number;
        iat: number;
        jti: string;
        body: string;
    };

    return true;
}
