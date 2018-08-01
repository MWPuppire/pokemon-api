var fs = require('fs')
var path = require('path')
var _this = {}
var allByName = function (type) {
  if (!_this.byName) {
    _this.byName = {}
  }
  if (_this.byName[type]) {
    return _this.byName[type]
  }
  _this.byName[type] = {}
  var data = JSON.parse(fs.readFileSync(path.join(__dirname, './data/' + type + '.json'), 'utf8'))
  _this.byName[type] = data
  return data
}
var pokemonById = function () {
  if (_this.pokemonByIdList) {
    return _this.pokemonByIdList
  }
  _this.pokemonByIdList = {}
  var list = allByName('pokemon')
  Object.keys(list).map(function (key, _index) {
    _this.pokemonByIdList[list[key].national_id] = list[key]
  })
  return _this.pokemonByIdList
}
var findByType = function (type, name) {
  var list = allByType(type)
  var obj = list[name]
  if (!obj) return null
  return obj
}
var allByType = function (type, conditions) {
  conditions = conditions || {}
  var list = allByName(type)
  var objects = []
  Object.keys(list).map(function (key) {
    var item = list[key]
    if (Object.keys(conditions).length === 0) {
      objects.push(item)
    } else {
      Object.keys(conditions).map(function (attr) {
        var value = conditions[attr]
        if (attr === 'dex') {
          if (item[value + '_id']) {
            objects.push(item)
          }
        } else if (item[attr] && item[attr].constructor === Array) {
          if (item[attr].indexOf(value) > -1) {
            objects.push(item)
          }
        } else {
          if (item[attr] === value) {
            objects.push(item)
          }
        }
      })
    }
  })
  return objects
}
var pokedex = {
  findPokemon: function (idOrName) {
    var list = allByName('pokemon')
    if (typeof idOrName === 'string') idOrName = idOrName.charAt(0).toUpperCase() + idOrName.slice(1)
    var obj = list[idOrName]
    if (!obj) {
      var listId = pokemonById()
      obj = listId[idOrName]
      if (!obj) {
        return null
      }
      return obj
    }
    return obj
  },
  findMove: function (name) {
    return findByType('move', name)
  },
  findAbility: function (name) {
    return findByType('ability', name)
  },
  findType: function (name) {
    return findByType('type', name)
  },
  findRegion: function (name) {
    return findByType('region', name)
  },
  findEggGroup: function (name) {
    return findByType('egg_group', name)
  },
  findGeneration: function (name) {
    return findByType('generation', name)
  },
  findNature: function (name) {
    return findByType('nature', name)
  },
  allPokemon: function (conditions) {
    conditions = conditions || {}
    if (conditions.type) {
      conditions.types = conditions.type
    }
    if (conditions.egg_group) {
      conditions.egg_groups = conditions.egg_group
    }
    return allByType('pokemon', conditions)
  },
  allMoves: function (conditions) {
    return allByType('move', conditions)
  },
  allAbilities: function (conditions) {
    return allByType('ability', conditions)
  },
  allTypes: function (conditions) {
    return allByType('type', conditions)
  },
  allRegions: function (conditions) {
    return allByType('region', conditions)
  },
  allEggGroups: function (conditions) {
    return allByType('egg_group', conditions)
  },
  allGenerations: function (conditions) {
    return allByType('generation', conditions)
  },
  allNatures: function (conditions) {
    return allByType('nature', conditions)
  },
  allByName: allByName,
  pokemonById: pokemonById,
  findByType: findByType,
  allByType: allByType
}
module.exports = pokedex
