
import { Cloudinary } from "@cloudinary/url-gen";

// Return "https" URLs by setting secure: true
const cld = new Cloudinary({
    cloud: {
        cloudName: 'dpegpgjpr',
        apiKey: '565159121244273',
        apiSecret: 'wJDT64oQ7D1lnmwkv6CdeLjgsok',
    }
});


export const uploadImage = async (imageBase64: string) => {
    const formData = new FormData();
    formData.append('file', imageBase64);
    formData.append('upload_preset', 'dtqj09md');

    try {
        const response = await fetch(`https://api.cloudinary.com/v1_1/dpegpgjpr/image/upload`, {
            method: 'POST',
            body: formData,
        });
        const data = await response.json();
        if (data.secure_url) {

            return data.secure_url; // Or any action with the URL
        }
    } catch (error) {
        console.error('Upload failed', error);
    }
};