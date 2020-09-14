import { DataTypes } from 'sequelize'

export default sequelize => {
  const Team = sequelize.define('team', {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
  })

  Team.associate = models => {
    Team.belongsToMany(models.User, {
      through: 'member',
      foreignKey: 'teamId',
    })
    Team.belongsTo(models.User, {
      foreignKey: 'owner',
    })
  }

  return Team
}
