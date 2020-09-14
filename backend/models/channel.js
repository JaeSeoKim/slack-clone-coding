import { DataTypes } from 'sequelize'

export default sequelize => {
  const Channel = sequelize.define('channel', {
    name: DataTypes.STRING,
    public: DataTypes.BOOLEAN,
  })

  Channel.associate = models => {
    // 1:M
    Channel.belongsTo(models.Team, {
      foreignKey: 'teamId',
    })
  }

  return Channel
}
