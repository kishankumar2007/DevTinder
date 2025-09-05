const cloudinary = require("cloudinary").v2
const fs = require("node:fs")
const dotenv = require("dotenv")

dotenv.config({
    path: "./.env"
})

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDNARY_API_KEY,
    api_secret: process.env.CLOUDNARY_API_SECRET,
})

const uploadOnCloudinary = async (localFilePath) => {
    try {
        
        const response = await cloudinary.uploader.upload(localFilePath, { resource_type: "auto" })
        fs.unlinkSync(localFilePath)
        return { url: response.url, fileId: response.public_id};
    } catch (error) {
        console.log("Cloudinary Error: ",error.message);
    }
}

const deleleteFromCloudinary = async (public_Id) => {
    try {
       const res= await cloudinary.uploader.destroy(public_Id)
       return res
    } catch (error) {
        console.log(error.message)
    }
}

module.exports = { uploadOnCloudinary, deleleteFromCloudinary }