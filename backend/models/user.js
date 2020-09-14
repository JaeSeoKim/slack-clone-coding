import { DataTypes } from 'sequelize'

export default sequelize => {
  const User = sequelize.define('user', {
    username: {
      type: DataTypes.STRING,
      unique: true,
    },
    email: {
      type: DataTypes.STRING,
      unique: true,
    },
    password: DataTypes.STRING,
  })

  User.associate = models => {
    User.belongsToMany(models.Team, {
      through: 'member',
      foreignKey: 'userId',
    })
  }

  return User
}
