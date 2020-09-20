import bcrypt from 'bcrypt'

export default {
  Query: {
    getUser: (_parent, { id }, { models }) =>
      models.User.findOne({ where: { id } }),
    allUsers: (_parent, _args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (_parent, { password, ...args }, { models }) => {
      try {
        const hashedPasswd = await bcrypt.hash(password, 12)
        await models.User.create({ password: hashedPasswd, ...args })
        return true
      } catch (error) {
        return false
      }
    },
  },
}
