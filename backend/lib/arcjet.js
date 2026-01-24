 import arcjet, {tokenBucket, shield, detectBot} from "@arcjet/node";

 import "dotenv/config";

 export const aj = arcjet({
  key: process.env.ARCJET_KEY,
  characteristics: ["ip.src"],
  rules: [
    // Shield protects against common attacks like SQL injection, cross-site scripting, and more
    shield({mode: "LIVE"}),
    detectBot({
      mode: "LIVE",
      allow: [
        "CATEGORY:SEARCH_ENGINE",
      ]
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 30,
      interval: 5,
      capacity: 20,
    }),
  ]
 });