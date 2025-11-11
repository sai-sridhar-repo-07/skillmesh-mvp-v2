import express from "express";
import { requireAuth } from "../middleware/auth";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const router = express.Router();

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

router.post("/presign", requireAuth, async (req, res) => {
  try {
    const { fileName, fileType } = req.body as { fileName: string; fileType: string };

    if (!fileName || !fileType) {
      return res.status(400).json({ message: "fileName and fileType are required" });
    }

    // Use a single key consistently (don’t call Date.now() twice)
    const key = `avatars/${Date.now()}-${fileName}`;

    const command = new PutObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET!,
      Key: key,
      ContentType: fileType,
    });

    // URL valid for 60 seconds
    const uploadURL = await getSignedUrl(s3, command, { expiresIn: 60 });

    const fileURL = `https://${process.env.AWS_S3_BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;

    return res.json({ uploadURL, fileURL, key });
  } catch (err) {
    console.error("Presign error:", err);
    return res.status(500).json({ message: "Failed to generate presigned URL" });
  }
});

export default router;
