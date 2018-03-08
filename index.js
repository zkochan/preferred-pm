'use strict'
const path = require('path')
const pathExists = require('path-exists')
const whichPM = require('which-pm')

module.exports = (pkgPath) => {
  return pathExists(path.join(pkgPath, 'package-lock.json'))
    .then(exists => {
      if (exists) {
        return {
          name: 'npm',
          version: '>=5'
        }
      }
      return pathExists(path.join(pkgPath, 'yarn.lock'))
        .then(exists => {
          if (exists) {
            return {
              name: 'yarn',
              version: '*'
            }
          }
          return pathExists(path.join(pkgPath, 'shrinkwrap.yaml'))
            .then(exists => {
              if (exists) {
                return {
                  name: 'pnpm',
                  version: '*'
                }
              }
              return whichPM(pkgPath).then(pm => pm && {name: pm.name, version: pm.version || '*'})
            })
        })
    })
}
