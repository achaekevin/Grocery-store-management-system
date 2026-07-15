import speakeasy from 'speakeasy';
import QRCode from 'qrcode';

/**
 * Generate 2FA secret
 */
export const generateSecret = (email, issuer = 'GroceryOS') => {
  const secret = speakeasy.generateSecret({
    name: `${issuer} (${email})`,
    issuer,
    length: 32,
  });

  return {
    secret: secret.base32,
    otpauthUrl: secret.otpauth_url,
  };
};

/**
 * Generate QR code for 2FA setup
 */
export const generateQRCode = async (otpauthUrl) => {
  try {
    const qrCode = await QRCode.toDataURL(otpauthUrl);
    return qrCode;
  } catch (error) {
    throw new Error(`QR code generation failed: ${error.message}`);
  }
};

/**
 * Verify 2FA token
 */
export const verifyToken = (token, secret) => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2, // Allow 2 time steps before/after for clock drift
  });
};

/**
 * Generate backup codes
 */
export const generateBackupCodes = (count = 10) => {
  const codes = [];
  for (let i = 0; i < count; i++) {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    codes.push(code);
  }
  return codes;
};

export default {
  generateSecret,
  generateQRCode,
  verifyToken,
  generateBackupCodes,
};
