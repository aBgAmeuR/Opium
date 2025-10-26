import { type UploadOptions, uploadFile } from "@opium/storage";

export const imageService = {
	async upload(file: File, options: UploadOptions) {
		const url = await uploadFile(file, options);
		return { url };
	},
};
