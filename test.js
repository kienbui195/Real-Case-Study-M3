const fs = require('fs');
const qs = require("qs");

fs.readFile('./token/' + 1661826037741, 'utf8', (err, data) => {
    eval('var obj='+data);
    console.log(obj)
});

