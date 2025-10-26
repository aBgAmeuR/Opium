import { db } from "@opium/db";
import { user } from "@opium/db/schema/auth";
import { adminProcedure } from "src/procedures";

export const adminRouter = {
	getUsers: adminProcedure.handler(async ({ context }) => {
		return await db.select().from(user);
	}),
};
