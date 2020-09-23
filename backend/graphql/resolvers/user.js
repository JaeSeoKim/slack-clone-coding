import bcrypt from 'bcrypt'
import _ from 'lodash'
import dotenv from 'dotenv'

import { tryLogin } from '../../lib/auth'

const NODE_ENV = process.env.NODE_ENV || 'development'
if (NODE_ENV === 'development') dotenv.config()

const formatErrors = (e, models) => {
  if (e instanceof models.Sequelize.ValidationError) {
    return e.errors.map(x => _.pick(x, ['path', 'message']))
  }
  return [{ path: 'name', message: 'something went wrong' }]
}

export default {
  Query: {
    getUser: (_parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (_parent, _args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (_parent, { password, ...otherArgs }, { models }) => {
      try {
        if (password.length < 5 || password.length > 100) {
          return {
            ok: false,
            errors: [
              {
                path: 'password',
                message: 'The password needs to be between 5 and 100 characters long',
              },
            ],
          }
        }

        const hashedPassword = await bcrypt.hash(password, 12)

        const user = await models.User.create({
          ...otherArgs,
          password: hashedPassword,
        })

        return {
          ok: true,
          user,
        }
      } catch (err) {
        return {
          ok: false,
          errors: formatErrors(err, models),
        }
      }
    },

    login: (_parent, { email, password }, { models }) => tryLogin(email, password, models, process.env.JWT_SECRET),
  },
}
