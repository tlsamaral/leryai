import 'dotenv/config'
import { app } from './app.js'

app
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })
  .then(() => {
    console.log('🚀 HTTP Server Running on port 3333!')
  })
