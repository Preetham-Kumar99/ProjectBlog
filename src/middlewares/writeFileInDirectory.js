const writeFileInDirectory =  function (req, res) {
    let files = req.files
    let directory = req.directory
    if(files && files.length > 0) {
        let fileName = files[0].originalname
        let fileData = files[0].buffer
        fs.writeFile(`${directory}/${fileName}`, fileData, function(error, data){
            if(error) {
                console.log(error)
                res.status(400).send({status: false, msg: "Invalid file. Please check."})
            } else {
                res.status(201).send('file created')
            }
        })
    } else {
        res.status(400).send({status: false, msg:"No file to write"})
    }
}

module.exports = {
    writeFileInDirectory
}