var fs = require('fs')
var path = require('path')
const os = require('os');
var cp = require('child_process')

let packages = []

const directoryTraverser = (dir) => {
  const files = fs.readdirSync(dir)
  files.forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.lstatSync(filePath)
    if (stat.isFile()) {
      if (file === 'package.json') {
        packages.push(dir)
      }
    } else if (stat.isDirectory()) {
      directoryTraverser(filePath)
    }
  })
}

function seedMockData() {
  directoryTraverser('./mock-data')
    packages.forEach(package => {
      // Determine OS and set command accordingly
      const npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm';
      // install folder
        console.log('Ready to install dependencies from', package)
        cp.spawn(npmCmd, ['i'], { env: process.env, cwd: package, stdio: 'inherit' })
    })
}

seedMockData()