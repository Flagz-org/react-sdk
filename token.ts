import * as jose from 'jose'

export const createToken = async ({ apiKey }: { apiKey: string }) => {
  if (!process.env[apiKey] || process.env[apiKey] == '') {
    throw new Error(
      `${apiKey} not set, set it on the environment, hint it needs to start with REACT_APP_`
    )
  }

  const secret = new TextEncoder().encode(process.env[apiKey] as string)
  const alg = 'HS256'

  const jwt = await new jose.SignJWT({ 'urn:flagz:claim': true })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    // .setIssuer('urn:flagz:issuer')
    // .setAudience('urn:flagz:audience')
    .setExpirationTime('2h')
    .sign(secret)

  return jwt
}
