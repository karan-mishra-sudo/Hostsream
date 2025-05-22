import multer from "multer";
import path from "path";
import fs from "fs";
import { createClient, RedisClientType } from 'redis';

let locations = {
    user_folder_loactions: "default",
    user_site_loactions: "default"
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploads = path.join(__dirname, "..", "uploads");
        if (!fs.existsSync(uploads)) {
            try {
                fs.mkdirSync(uploads, { recursive: true });
                console.log("uploads folder created successfully:", uploads);
            } catch (err) {
                console.error("Error creating uploads folder:", err);
            }
        }
        let folderPath = path.join(__dirname, "..", "uploads", locations.user_folder_loactions, locations.user_site_loactions);


        if (!fs.existsSync(folderPath)) {
            try {
                fs.mkdirSync(folderPath, { recursive: true });
                console.log("site Folder created successfully:", folderPath);
            } catch (err) {
                console.error("Error site folder creating folder:", err);
            }
        }
        cb(null, folderPath);

    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1024, // 10MB file size limit
        files: 50 // Maximum 50 files allowed
    }
});
let client: RedisClientType | undefined;

async function connect_redis() {
    if (!client) {
        client = createClient({
            url: process.env.REDIS_URL || 'redis://redis:6379', // Use service name
        });

        client.on('error', (err: Error) => {
            console.log('Redis Client Error', err);
        });

        client.on('connect', () => {
            console.log("redis is connected..");
        });

        await client.connect();
    }
    return client;
}
async function get_redis() {
    if (client) {
        return client;
    }
    return null;
}

export {
    storage,
    locations,
    upload,
    get_redis,
    connect_redis,

};