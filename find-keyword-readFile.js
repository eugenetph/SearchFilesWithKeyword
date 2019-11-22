const path = require('path');
const fs = require('fs');

let totalFilesScanned = 0
let filesMatched = 0

// main function to search files that contain specific word(s)
const searchFilesThatContainSpecificWords = (dir, keyword, fileExt) => {

    // check if directory is vaild else return
    if (!fs.existsSync(dir)) {
        console.log(`This directory: ${dir} does not exist`);
        return;
    }

    const files = getFilesInDirectory(dir, fileExt);

    printFilesThatContainSpecificWords(files, keyword);
}

// function to get all files in all directories
const getFilesInDirectory = (dir, fileExt) => {

    let files = [];
    fs.readdirSync(dir).forEach(file => {
        const filePath = path.join(dir, file); 
        // console.log('filepath ', filePath)
        const stat = fs.lstatSync(filePath);

        // 1. if filePath is a directory, call getFilesInDirectory again 
        // 2. else if filePath is a file, get file with specific extension name into array
        // 3. else filePath is a file, get file into array
        if (stat.isDirectory()) {
            const subDir = getFilesInDirectory(filePath, fileExt);
            files = files.concat(subDir);
        } else if(fileExt) {
            if(path.extname(file) === fileExt) {
               files.push(filePath); 
            }
        } else {
            files.push(filePath); 
        }
    });
    
    return files;
}

// function the print all the filepath which contain specific word(s)
const printFilesThatContainSpecificWords = (files, keyword) => {
    files.forEach(file => {
        const fileContent = fs.readFileSync(file);
        if(fileContent.includes(keyword)) {
            console.log(`${keyword} keyword is found in file: ${file}`);
            filesMatched++;
        }
        totalFilesScanned++;
    });
}

const dir = process.argv[2];
const keyword = process.argv[3]; 
const fileExt = process.argv[4]; // empty string to search all files else search for file with specific extension e.g. ".js"

console.time('Execution Time');
searchFilesThatContainSpecificWords(dir, keyword, fileExt);
console.timeEnd('Execution Time');
console.log(`Total files scanned: ${totalFilesScanned}`);
console.log(`Total files matched: ${filesMatched}`);
