const app = require('./api/index')
const { syncAndSeed } = require('./db/index')

const PORT = process.env.PORT || 3000

syncAndSeed()
  .then(() => app.listen(PORT, () => console.log(`listening on PORT ${PORT}`)))
  .catch(err => {
    console.log(
      'The following error has occured in connecting or syncing with the database'
    )
    console.log(err)
  })
