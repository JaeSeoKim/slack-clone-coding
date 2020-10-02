import bcrypt from 'bcrypt'
import { DataTypes } from 'sequelize'

export default sequelize => {
  const User = sequelize.define(
    'user',
    {
      username: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isAlphanumeric: {
            args: true,
            msg: 'The UserName can only contain letters and numbers...',
          },
          len: {
            args: [3, 25],
            msg: 'The UserName need to be between 3 and 25 characters long',
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          isEmail: {
            args: true,
            msg: 'Invaild email',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
          len: {
            args: [10, 100],
            msg: 'The Password need to be between 10 and 100 characters long',
          },
        },
      },
    },
    {
      hooks: {
        afterValidate: async user => {
          // eslint-disable-next-line no-param-reassign
          user.password = await bcrypt.hash(user.password, 12)
        },
      },
    },
  )

  User.associate = models => {
    User.belongsToMany(models.Team, {
      through: 'member',
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    })
    // N:M
    User.belongsToMany(models.Channel, {
      through: 'channel_member',
      foreignKey: {
        name: 'userId',
        field: 'user_id',
      },
    })
  }

  return User
}
