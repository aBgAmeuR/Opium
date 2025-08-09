import { publicProcedure, adminProcedure } from "../../core/orpc";
import { AlbumsService } from "./service";
import { zCreateAlbumInput, zListAlbumsInput } from "./dto";

export const albumsRouter = {
    list: publicProcedure.input(zListAlbumsInput).handler(async ({ input }) => AlbumsService.list(input)),
    create: adminProcedure.input(zCreateAlbumInput).handler(async ({ input }) => AlbumsService.create(input)),
};


