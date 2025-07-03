const express = require('express')
const mongoose = require('mongoose')

const personRouter = require('./controllers/persons')
const logger = require('./utils/logger')
const middleware = require('./utils/middleware')
const config = require('./utils/config')

const app = express()

logger.info("Connecting to mongodb")

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        console.log('Connected to mongodb')
    })
    .catch(error => {
        console.log('Error connecting to mongodb',error.message)
    })

app.use(express.static('dist'))
app.use(express.json())

app.use(middleware.requestLogger)

app.use('/api/persons',personRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app