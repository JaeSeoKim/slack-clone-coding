/* eslint-disable global-require */
import { Sequelize } from 'sequelize'
import dotenv from 'dotenv'

const NODE_ENV = process.env.NODE_ENV || 'development'
if (NODE_ENV === 'development') dotenv.config()

const DATABASE_URI =
  process.env.DATABASE_URI || 'postgres://slack:slack@localhost:5432/slack'

const sequelize = new Sequelize(DATABASE_URI)

const models = {
  User: require('./user').default(sequelize, Sequelize.DataTypes),
  Channel: require('./channel').default(sequelize, Sequelize.DataTypes),
  Message: require('./message').default(sequelize, Sequelize.DataTypes),
  Team: require('./team').default(sequelize, Sequelize.DataTypes),
}

Object.keys(models).forEach(modelName => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models)
  }
})

models.sequelize = sequelize
models.Sequelize = Sequelize

export default models
