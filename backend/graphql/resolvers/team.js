export default {
  Mutation: {
    createTeam: async (_parent, args, { models, user }) => {
      try {
        await models.Team.create({ ...args, owner: user.id })
        return true
      } catch (err) {
        console.log(err)
        return false
      }
    },
  },
}
