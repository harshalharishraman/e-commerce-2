const multer = require('multer')
const multerS3 = require('multer-s3')

const { S3Client, DeleteObjectCommand, Bucket$ } = require('@aws-sdk/client-s3')

const path = require('path')

const s3 = new S3Client({
    region: process.env.AWS_REGION,

    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY
    }
})

const upload = multer({

    storage: multerS3({

        s3: s3,

        bucket: process.env.AWS_BUCKET_NAME,

        contentType: multerS3.AUTO_CONTENT_TYPE,

        key: (req, file, cb) => {

            const uniqueName =
                Date.now() +
                path.extname(file.originalname)

            cb(null,`sub-categories-images/${uniqueName}`)
        }
    }),

    limits: {
        fileSize: 5 * 1024 * 1024
    }
})

const del_img=async(key)=>{
    try {
        await s3.send(new DeleteObjectCommand({
            Bucket:process.env.AWS_BUCKET_NAME,
            Key:key})
        )

        return true} 
        
    catch (error) {
        console.error(error)
        throw error
    }
}


module.exports = {upload,del_img}