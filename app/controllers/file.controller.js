const uploadFile = require("../middleware/upload");
const upload = async (req,res)=>{
    try {
        console.log("FileControllerFile");
        await uploadFile(req,res);
        if(req.file == undefined){
            return res.status(400).send({
                message: "Not Found the upload file"
            });
        }
        res.status(200).send({
            message: "Upload file successfuly: " + req.file.filename,
            uploadFileName: req.file.filename
        });
    } catch (error) {
        res.status(500).send({
            message: "Could not upload the file: " + error
        });
    }
};
// const uploadeController = async(req,res)=>{

// };
const download = (req,res)=>{
    const filename = req.params.name;
    const directoryPath = __basedir + "/assets/";
    res.dowload (directoryPath + filename,filename,(err)=>{
        if(err){
            res.status(500).send({message: "Could not display the file." +err})
        }
    });
}
module.exports = { upload,download};