import RNSimpleCrypto from 'react-native-simple-crypto';

// must escape string
const RSA_PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\r\nMIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQDEC/SVIgvg130roN+UTttHy1pMHZlis3shBwyKqPFou2LxY8gTjnVbhbSFU10IseWxomct7vKrBFuAvgsEFrnzBVtpo1M3DGsRy4jJVmPj34A4M656Cc+kMVaDP6xOGbn+r8CO1oPvol9kX1DX9RpousntQVfgp8PKRqZTaMhcDwIDAQAB\r\n-----END PUBLIC KEY-----';

async function encryptData(data: string) {
    const rsaEncryptedMessage = await RNSimpleCrypto.RSA.encrypt(
        data,
        RSA_PUBLIC_KEY
    );
    return rsaEncryptedMessage.replace(/(\n|\r| )/gm, '');
}

export default {
    encryptData
};
