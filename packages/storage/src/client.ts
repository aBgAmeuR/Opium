import { S3Client } from "@aws-sdk/client-s3";

export const config = {
	bucketName: process.env.AWS_S3_BUCKET_NAME ?? "",
	bucketUrl: process.env.AWS_S3_API_URL ?? "",
	accessKeyId: process.env.AWS_ACCESS_KEY_ID ?? "",
	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY ?? "",
	domain: process.env.R2_URL ?? "",
} as const;

export const s3 = new S3Client({
	region: "auto",
	endpoint: config.bucketUrl,
	credentials: {
		accessKeyId: config.accessKeyId,
		secretAccessKey: config.secretAccessKey,
	},
});