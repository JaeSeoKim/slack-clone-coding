export default {
  Query: {
    getUser: (_parent, { id }, { models }) =>
      models.User.findOne({ where: { id } }),
    allUsers: (_parent, _args, { models }) => models.User.findAll(),
  },
  Mutation: {
    createUser: (_parent, args, { models }) => models.User.create(args),
  },
}
