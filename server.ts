import express, { Express, Request, Response } from 'express'
import { IncomingMessage } from 'http'
import path from 'path'
const dotenv = require('dotenv')
const bodyParser = require('body-parser')
const https = require('https')
dotenv.config()

const app = express()
const port = process.env.PORT
const appid = process.env.APIKEY
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (request: Request, response: Response) => {
    const htmlFile = path.join(__dirname, '..', 'src/index.html')
    response.sendFile(htmlFile)

})

app.post('/', (request: Request, response: Response) => {
    const query = request.body.query
    const unit = 'metric'
    const endpoint = 'https://api.openweathermap.org/data/2.5/weather'
    const url = `${endpoint}?q=${query}&units=${unit}&appid=${appid}`
    https.get(url, (res: IncomingMessage) => {
        res.on('data', (data) => {
            const jsonData = JSON.parse(data)
            if (jsonData.cod !== 200) {
                response.write(`<h1>Search(city): ${query}</h1>`)
                response.write(`<h2>${jsonData.message}</h2>`)
            } else {
                response.write(`<h1>The weather in ${query}</h1>`)
                response.write(`<h2>${jsonData.weather[0].main}</h2>`)
                response.write(`<h2>${jsonData.weather[0].description}</h2>`)
            }

            console.log(jsonData)
            response.write(`<a href =' / '>Back</a>`)
            response.send()
        })
    })
})


app.listen(port, () => {
    console.log(`[SERVER]: Server is running at https://localhost:${port}`)
})