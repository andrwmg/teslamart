module.exports = {
    url: process.env.LOCAL ?  'mongodb://localhost:27017/teslamart' : process.env.DB_URL
  };