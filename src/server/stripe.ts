import stripe from "stripe";
import {env} from "@/env.mjs"

const stripeSecret = env.STRIPE_SECRET_KEY || "";
const accountId = env.STRIPE_ACCOUNT_ID || "";

export const stripeClient = new stripe(stripeSecret, { 
        stripeAccount: accountId,
        apiVersion: "2022-11-15"
});