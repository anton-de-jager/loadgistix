// Environment template - Copy to environment.ts and fill in values
// DO NOT commit environment.ts with real values to version control

export const environment = {
    production: true,

    url: '${APP_URL}/',
    apiDotNet: '${API_URL}/api/',
    apiImage: '${API_URL}/Images/',
    hubs: 'wss://${API_HOST}/hubs/',
    apiSecret: '${JWT_SECRET}',
    actionUrl: 'https://payment.payfast.io/eng/process',

    googleClientId: '${GOOGLE_CLIENT_ID}',
    apiKey: '${GOOGLE_API_KEY}',

    paystack_key: '${PAYSTACK_PUBLIC_KEY}',
    paystack_secretKey: '${PAYSTACK_SECRET_KEY}',
    paystack_key_test: '${PAYSTACK_PUBLIC_KEY_TEST}',
    paystack_secretKey_test: '${PAYSTACK_SECRET_KEY_TEST}',
    paystack_id: '${PAYSTACK_ID}',
    paystack_url: 'https://api.paystack.co:443/plan'
};

