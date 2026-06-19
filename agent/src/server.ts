import { app } from './app.js'
import { env } from './env.js'

app
  .listen({
    host: env.HOST,
    port: env.PORT,
  })
  .then(() => {
    console.info(`🧠 Lery Agent running on http://${env.HOST}:${env.PORT}`)
  })
  .catch((err) => {
    app.log.error(err)
    process.exit(1)
  })
