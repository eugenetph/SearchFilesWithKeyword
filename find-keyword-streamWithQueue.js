const path = require('path');
const fs = require('fs');
const readline = require('readline')

let totalFilesScanned = 0
let filesMatched = 0
const numOfWorkers = 100

// main function to search files that contain specific word(s)
const searchFilesThatContainSpecificWords = (dir, keyword, fileExt) => {

    // check if directory is vaild else return
    if (!fs.existsSync(dir)) {
        console.log(`This directory: ${dir} does not exist`);
        return;
    }
    const files = getFilesInDirectory(dir, fileExt);
    totalFilesScanned = files.length
    return new Promise((resolve, reject) => {
        createQueue(files, numOfWorkers, keyword).then(() => {
            console.log(`Total files scanned: ${totalFilesScanned}`);
            console.log(`Total files matched: ${filesMatched}`)
            resolve('done')
        });
    })
}

// function to get all files in all directories
const getFilesInDirectory = (dir, fileExt) => {

    let files = [];
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.lstatSync(filePath);

        // 1. if filePath is a directory, call getFilesInDirectory again 
        // 2. else if filePath is a file, get file with specific extension name into array
        // 3. else filePath is a file, get file into array
        if (stat.isDirectory()) {
            const subDir = getFilesInDirectory(filePath, fileExt);
            files = files.concat(subDir);
        } else if (fileExt) {
            if (path.extname(file) === fileExt) {
                files.push(filePath);
            }
        } else {
            files.push(filePath);
        }
    });

    return files;
}

// function to create workers to improve speed
function createQueue(files, maxNumOfWorkers = 100, keyword) {
    var numOfWorkers = 0;
    var fileIndex = 0;

    const readFile = (file, keyword) => {
        return new Promise((resolve, reject) => {
            const inStream = fs.createReadStream(file)

            const rl = readline.createInterface(inStream, false)
            rl.on('line', (line) => {
                if (line.includes(keyword)) {
                    console.log(`${keyword} keyword is found in file: ${file}`);
                    filesMatched++;
                    inStream.destroy();
                    resolve(filesMatched)
                    rl.close()
                    rl.removeAllListeners()
                }
            })
                .on('close', () => {
                    resolve(filesMatched)
                })
                .on('end', () => {
                    console.log('end of file')
                })
                .on('error', () => {
                    console.log('error occur')
                })
        })
    }

    return new Promise(done => {
        const handleResult = fileIndex => result => {
            // console.log('taskIndex is done', fileIndex)
            numOfWorkers--;
            getNextTask();
        };
        const getNextTask = () => {
            // console.log('worker', numOfWorkers) 
            if (numOfWorkers < maxNumOfWorkers && fileIndex < files.length) {
                readFile(files[fileIndex], keyword).then(handleResult(fileIndex)).catch(handleResult(fileIndex));
                fileIndex++;
                numOfWorkers++;
                getNextTask();
            } else if (numOfWorkers === 0 && fileIndex === files.length) {
                done(filesMatched);
            }
        };
        getNextTask();
    });
}

const dir = process.argv[2]; //parent directory path
const keyword = process.argv[3]; // keyword to search
const fileExt = process.argv[4]; // empty string to search all files else search for file with specific extension e.g. ".js"

console.time('Execution Time');
searchFilesThatContainSpecificWords(dir, keyword, fileExt).then(done => {
    if (done) {
        console.timeEnd('Execution Time')
    }
}).catch(done => console.log('err', done));