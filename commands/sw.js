var SofwareCatalogue = require("../lib/softwarecatalogue.js")

function lookupItem(name){
    SofwareCatalogue.getItem(name)
    .then(function (data){
        console.log(data)
    },
    function (err) {
        console.log(err)
    })

}
exports.lookupItem = lookupItem;

lookupItem("Office 365");