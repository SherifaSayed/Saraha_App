import multer from "multer"
 import {fileExtensions} from '../Common/constants.js'
export const multerLocal = ()=>
{
    const storage = multer.diskStorage({
        destination:'uploads',
        filename:function(req, file, cb){
            const uniqueSuffix= Date.now()+'-'+Math.round(Math.random()*1E9);
            cb(null, uniqueSuffix+'.'+this.filename.originalname)
        }
    })

    const fileFilter = function (req, file , cb){
        const [fileType, fileExtensions] = file.mimetype.split('/');
        const allowedExtensions= fileExtensions[fileType];
    if(allowedExtensions.includes(fileExtensions))
        {
            return cb(null, true);

        }
        return cb( new Error('File tyoe not allowed'));
    }
    return multer ({fileFilter,storage})

}

export default multerLocal;