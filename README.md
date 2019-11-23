# Search Files with Keyword

An application written in JavaScript to search files for a specific words in a working directory.

## Approach
Two implementation used to search files for a specific
1. ReadFile - Synchronous
2. Stream   - Asynchronous

For ReadFile implementation is very straight forward

For Stream implementation is slightly different. In the program, readline is used to read a file line by line and terminate once the specific words is found. Besides, using queue with threads to do parallel reading from a file. 

## Challenge
* Nested directories
* Many sub-directories and large file
* Too many files opened and unable to read finish which lead to runtime error (For Stream)

## Installation of application

   ```bash
    git clone https://github.com/eugenetph/SearchFilesWithKeyword.git
   ```
   
## Download mock data
You can run this application on your own projects or you can also use mock data provided by running this command.
After running the command successful, you will get two folders mock-data-small & mock-data-large in the directory.
 
   ```bash
    npm run seed-data
   ```
>  WARNING! Don't run this command 2nd time if not your device will explode(lag) because the script will traverse the downloaded files.

 
 ## Run test for mock-data (Small & large)
 
 For ReadFile search application run
 
   ```bash
    node find-keyword-readFile.js ./mock-data/mock-data-small [keyword] [fileExtension]
   ```
   ```bash
    node find-keyword-readFile.js ./mock-data/mock-data-large [keyword] [fileExtension]
   ```
   
  For Stream search application run
  
  ```bash
    node find-keyword-streamWithQueue ./mock-data/mock-data-small [keyword] [fileExtension]
  ```
  ```bash
    node find-keyword-streamWithQueue ./mock-data/mock-data-large [keyword] [fileExtension]
  ```
  > Note: To search all files, you can leave the fileExtension parameter empty.
  
  
## Reference
Implementing async queue:

http://krasimirtsonev.com/blog/article/implementing-an-async-queue-in-23-lines-of-code

Read file line by line:

https://stackabuse.com/reading-a-file-line-by-line-in-node-js/

Get all files name in directory:

https://stackoverflow.com/questions/2727167/how-do-you-get-a-list-of-the-names-of-all-files-present-in-a-directory-in-node-j?rq=1
https://itnext.io/using-node-js-to-read-really-really-large-files-pt-1-d2057fe76b33

Implementation with readFile:

https://stackabuse.com/read-files-with-node-js/

Implementation with Stream:

https://medium.com/@dalaidunc/fs-readfile-vs-streams-to-read-text-files-in-node-js-5dd0710c80ea

Run npm install in nested directories:

https://stackoverflow.com/questions/31773546/the-best-way-to-run-npm-install-for-nested-folders
  
  
 
