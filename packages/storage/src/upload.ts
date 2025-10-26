import { PutObjectCommand } from "@aws-sdk/client-s3";
import { config, s3 } from "./client";

export type UploadOptions = {
	prefix: string;
	fileName?: string;
};

export async function uploadFile(
	file: File,
	options: UploadOptions,
): Promise<string> {
	const fileBuffer = await file.arrayBuffer();
	const buffer = Buffer.from(fileBuffer);

	const fileExtension = file.name.split(".").pop();
	const fileName =
		options.fileName ||
		`${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExtension}`;
	const key = `${options.prefix}/${fileName}`;

	const command = new PutObjectCommand({
		Bucket: config.bucketName,
		Key: key,
		Body: buffer,
		ContentType: file.type,
	});

	try {
		await s3.send(command);
		return `${config.domain}/${key}`;
	} catch (error) {
		console.error(error);
		throw error;
	}
}
