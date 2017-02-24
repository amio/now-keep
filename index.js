const axios = require('axios')

const INTERVAL = 1000 * 60 * 60 * 3 // 3 hours
const LOG_MAX = 8

const endpoints = {
  'https://fe-lenses.now.sh': [],
  'https://keep.now.sh': [],
  'https://amio.now.sh': [],
  'https://go.now.sh': []
}

function task () {
  for (const url in endpoints) {
    let result = []
    axios.get(url).then(resp => {
      result = [new Date().toISOString(), resp.status, resp.statusText]
    }).catch(e => {
      result = [new Date().toISOString(), e.message]
    }).then(() => {
      endpoints[url].unshift(result.join(' - '))
      if (endpoints[url].length > LOG_MAX) {
        endpoints[url].pop()
      }
    })
  }

  return setTimeout(task, INTERVAL)
}

task()

// SERVER

const micro = require('micro')
const server = micro(async (req, res) => {
  return JSON.stringify(endpoints, null, 2)
})

server.listen(3000)
