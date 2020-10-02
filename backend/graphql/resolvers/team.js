import formatErrors from '../../lib/tools/formatErrors'
import requiresAuth from '../../lib/tools/requiresAuth'

export default {
  Mutation: {
    createTeam: requiresAuth.createResolver(async (_parent, args, { models, user }) => {
      try {
        await models.Team.create({ ...args, owner: user.id })
        return {
          ok: true,
        }
      } catch (err) {
        console.log(err)
        return {
          ok: false,
          errors: formatErrors(err),
        }
      }
    }),
  },
}
