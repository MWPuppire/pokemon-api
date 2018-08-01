const http = require('http')
const path = require('path')
const fs = require('fs')
const pokedex = require('./pokedex/index.js')
const readline = require('readline')
readline.emitKeypressEvents(process.stdin)
function arrayToObject (arr) {
  var data = { }
  for (var item of arr) {
    var key = item.names.en
    data[encodeURIComponent(key)] = data[encodeURIComponent(key).replace('%20', '-')] = data[encodeURIComponent(key).replace('%20', '')] = data[encodeURIComponent(key).replace('.', '').replace('%20', '-')] = data[encodeURIComponent(key).replace('.', '').replace('%20', '')] = data[encodeURIComponent(key).toLowerCase()] = data[encodeURIComponent(key).toLowerCase().replace('%20', '-')] = data[encodeURIComponent(key).toLowerCase().replace('%20', '')] = data[encodeURIComponent(key).toLowerCase().replace('.', '').replace('%20', '-')] = data[encodeURIComponent(key).toLowerCase().replace('.', '').replace('%20', '')] = item
  }
  return data
}
function arrayToNames (arr) {
  var data = [ ]
  for (var item of arr) {
    data.push(item.names.en)
  }
  return data
}
const pokemon = pokedex.allPokemon()
const pokemonById = pokedex.pokemonById()
const pokemonByName = arrayToObject(pokemon)
const pokemonNames = arrayToNames(pokemon)
const abilities = pokedex.allAbilities()
const abilitiesByName = arrayToObject(abilities)
const abilitiesNames = arrayToNames(abilities)
const moves = pokedex.allMoves()
const movesByName = arrayToObject(moves)
const movesNames = arrayToNames(moves)
const natures = pokedex.allNatures()
const naturesByName = arrayToObject(natures)
const naturesNames = arrayToNames(natures)
const eggGroups = pokedex.allEggGroups()
const eggGroupsByName = arrayToObject(eggGroups)
const eggGroupsNames = arrayToNames(eggGroups)
const regions = pokedex.allRegions()
const regionsByName = arrayToObject(regions)
const regionsNames = arrayToNames(regions)
const generations = pokedex.allGenerations()
const generationsByName = arrayToObject(generations)
const generationsNames = arrayToNames(generations)
const types = pokedex.allTypes()
const typesByName = arrayToObject(types)
const typesNames = arrayToNames(generations)
const games = { }
generations.forEach(function (el) {
  el.games.forEach(function (el2) {
    games[el2.en] = el.names.en
  })
})
const items = [ ]
const itemsByName = { }
var numInArgv = false
for (var i = 0; i < process.argv.length; i++) {
  if (!(isNaN(process.argv[i]))) numInArgv = parseInt(process.argv[i])
}
const port = numInArgv || process.env.PORT || 8080
var server = http.createServer(function (req, res) {
  var lookup = path.dirname(req.url).slice(1).toLowerCase().trim().replace(' ', '').replace('-', '')
  var identifier = path.basename(req.url)
  if (identifier && !lookup) {
    lookup = identifier
    identifier = ''
  }
  var data = null
  var all = false
  var m
  var img
  switch (lookup) {
    case 'pokemon': {
      if (pokemonByName[identifier]) data = pokemonByName[identifier]
      if (!data && pokemonById[identifier]) data = pokemonById[identifier]
      if (!data) {
        all = 'pokemon'
      }
      break
    }
    case 'types': {
      if (typesByName[identifier]) data = typesByName[identifier]
      if (!data && types[identifier - 1]) data = types[identifier - 1]
      if (!data) {
        all = 'types'
      }
      break
    }
    case 'moves': {
      if (movesByName[identifier]) data = movesByName[identifier]
      if (!data && moves[identifier - 1]) data = moves[identifier - 1]
      if (!data) {
        all = 'moves'
      }
      break
    }
    case 'natures': {
      if (naturesByName[identifier]) data = naturesByName[identifier]
      if (!data && natures[identifier - 1]) data = natures[identifier - 1]
      if (!data) {
        all = 'natures'
      }
      break
    }
    case 'abilities': {
      if (abilitiesByName[identifier]) data = abilitiesByName[identifier]
      if (!data && abilities[identifier - 1]) data = abilities[identifier - 1]
      if (!data) {
        all = 'abilities'
      }
      break
    }
    case 'egggroups': {
      if (eggGroupsByName[identifier]) data = eggGroupsByName[identifier]
      if (!data && eggGroups[identifier - 1]) data = eggGroups[identifier - 1]
      if (!data) {
        all = 'egggroups'
      }
      break
    }
    case 'regions': {
      if (regionsByName[identifier]) data = regionsByName[identifier]
      if (!data && regions[identifier - 1]) data = regions[identifier - 1]
      if (!data) {
        all = 'regions'
      }
      break
    }
    case 'generations': {
      if (generationsByName[identifier]) data = generationsByName[identifier]
      if (!data && generations[identifier - 1]) data = generations[identifier - 1]
      if (!data) {
        all = 'generations'
      }
      break
    }
    case 'sprites/items': {
      img = fs.readFileSync('sprites/items/' + identifier + '.png')
      m = encodeURIComponent(data).match(/%[89ABab]/g)
      res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': img.length + (m ? m.length : 0) })
      res.end(img, 'binary')
      return
    }
    case 'sprites': {
      if (pokemonByName[identifier]) identifier = pokemonByName[identifier].national_id
      try {
        img = fs.readFileSync('sprites/' + identifier + '.png')
      } catch (e) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end('null')
        return
      }
      m = encodeURIComponent(data).match(/%[89ABab]/g)
      res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': img.length + (m ? m.length : 0) })
      res.end(img, 'binary')
      return
    }
    case 'sprites/female': {
      if (pokemonByName[identifier]) identifier = pokemonByName[identifier].national_id
      try {
        img = fs.readFileSync('sprites/female/' + identifier + '.png')
      } catch (e) {
        try {
          img = fs.readFileSync('sprites/' + identifier + '.png')
        } catch (e2) {
          res.writeHead(404, { 'Content-Type': 'application/json' })
          res.end('null')
          return
        }
      }
      m = encodeURIComponent(data).match(/%[89ABab]/g)
      res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': img.length + (m ? m.length : 0) })
      res.end(img, 'binary')
      return
    }
    case 'sprites/shiny': {
      if (pokemonByName[identifier]) identifier = pokemonByName[identifier].national_id
      try {
        img = fs.readFileSync('sprites/shiny/' + identifier + '.png')
      } catch (e) {
        res.writeHead(404, { 'Content-Type': 'application/json' })
        res.end('null')
        return
      }
      m = encodeURIComponent(data).match(/%[89ABab]/g)
      res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': img.length + (m ? m.length : 0) })
      res.end(img, 'binary')
      return
    }
    case 'sprites/shiny/female': {
      if (pokemonByName[identifier]) identifier = pokemonByName[identifier].national_id
      try {
        img = fs.readFileSync('sprites/shiny/female/' + identifier + '.png')
      } catch (e) {
        try {
          img = fs.readFileSync('sprites/shiny/' + identifier + '.png')
        } catch (e2) {
          res.writeHead(404, { 'Content-Type': 'application/json' })
          res.end('null')
          return
        }
      }
      m = encodeURIComponent(data).match(/%[89ABab]/g)
      res.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': img.length + (m ? m.length : 0) })
      res.end(img, 'binary')
      return
    }
    case 'items': {
      if (itemsByName[identifier]) data = itemsByName[identifier]
      if (!data && items[identifier]) data = items[identifier]
      if (!data) {
        all = 'items'
      }
      break
    }
    case 'all': {
      all = identifier.toLowerCase().trim().replace(' ', '').replace('-', '') || 'all'
      break
    }
    case '': {
      data = [ 'all', 'moves', 'generations', 'pokemon', 'egggroups', 'regions', 'natures', 'abilities', 'types', 'items' ]
      break
    }
  }
  if (all) {
    switch (all) {
      case 'pokemon': {
        data = pokemonNames
        break
      }
      case 'types': {
        data = typesNames
        break
      }
      case 'moves': {
        data = movesNames
        break
      }
      case 'natures': {
        data = naturesNames
        break
      }
      case 'abilities': {
        data = abilitiesNames
        break
      }
      case 'egggroups': {
        data = eggGroupsNames
        break
      }
      case 'regions': {
        data = regionsNames
        break
      }
      case 'generations': {
        data = generationsNames
        break
      }
      case 'games': {
        data = games
        break
      }
      case 'items': {
        break
      }
      case 'all': {
        data = [ 'moves', 'generations', 'pokemon', 'egggroups', 'regions', 'natures', 'abilities', 'types', 'games', 'items' ]
        break
      }
    }
  }
  var statusCode = data ? 200 : 404
  data = JSON.stringify(data)
  m = encodeURIComponent(data).match(/%[89ABab]/g)
  var length = data.length + (m ? m.length : 0)
  var headers = { 'Content-Type': 'application/json', 'Content-Length': length }
  res.writeHead(statusCode, headers)
  res.end(data)
}).listen(port)
console.log('Listening on port ' + port)
console.log('Press Control-C to quit')
process.stdin.on('keypress', function (str, key) {
  if (key.ctrl && key.name === 'c') {
    process.stdout.write('^C\n')
    server.close()
    process.exit(0)
  }
})
