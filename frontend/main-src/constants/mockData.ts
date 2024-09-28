const defaultUserData = `{
    "id": "",
    "bannerMessage": "Bellevue Medical Centre",
    "isAdmin": true,
    "isPowerUser": true,
    "showDataPoints": false,
    "user": "trustedUser@vituity.com",
    "name": "Bob Mayers"
}`;

const jsonBlob = new Blob([defaultUserData], { type: 'application/json' });

export const jsonUrlFile = URL.createObjectURL(jsonBlob);