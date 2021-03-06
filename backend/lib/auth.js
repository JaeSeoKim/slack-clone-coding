import jwt from 'jsonwebtoken'
import _ from 'lodash'
import bcrypt from 'bcrypt'

export const createTokens = async (user, secret, secret2) => {
  const createToken = jwt.sign(
    {
      user: _.pick(user, ['id']),
    },
    secret,
    {
      expiresIn: '20m',
    },
  )

  const createRefreshToken = jwt.sign(
    {
      user: _.pick(user, 'id'),
    },
    secret2,
    {
      expiresIn: '7d',
    },
  )

  return Promise.all([createToken, createRefreshToken])
}

export const refreshTokens = async (token, refreshToken, models, SECRET) => {
  let userId = -1
  try {
    const {
      user: { id },
    } = jwt.decode(refreshToken)
    userId = id
  } catch (err) {
    return {}
  }

  if (!userId) {
    return {}
  }

  const user = await models.User.findOne({ where: { id: userId }, raw: true })

  if (!user) {
    return {}
  }

  try {
    jwt.verify(refreshToken, user.refreshSecret)
  } catch (err) {
    return {}
  }

  const [newToken, newRefreshToken] = await createTokens(user, SECRET, user.refreshSecret)
  return {
    token: newToken,
    refreshToken: newRefreshToken,
    user,
  }
}

export const tryLogin = async (email, password, models, SECRET, SECRET2) => {
  const user = await models.User.findOne({ where: { email }, raw: true })
  if (!user) {
    return {
      ok: false,
      errors: [
        {
          path: 'email',
          message: 'Worng email',
        },
      ],
    }
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return {
      ok: false,
      errors: [
        {
          path: 'password',
          message: 'Worng password',
        },
      ],
    }
  }
  const [token, refreshToken] = await createTokens(user, SECRET, SECRET2)

  return {
    ok: true,
    token,
    refreshToken,
  }
}
