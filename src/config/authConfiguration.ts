export const jwtConfiguration = {
  secret: process.env.JWT_SECRET || 'secretKey',
  signOptions: { expiresIn: '3600s' },
  ignoreExpiration: false,
};
