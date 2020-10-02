import { tryLogin } from '../../lib/auth'
import formatErrors from '../../lib/tools/formatErrors'

export default {
  Query: {
    getUser: (_parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (_parent, _args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (_parent, args, { models }) => {
      try {
        const user = await models.User.create(args)
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

    login: (_parent, { email, password }, { models, JWT_SECRET, JWT_SECRET2 }) =>
      tryLogin(email, password, models, JWT_SECRET, JWT_SECRET2),
  },
}
