import { z } from "zod";
import { publicProcedure, adminProcedure } from "../../core/orpc";
import { versionTypes } from "../../db/schema/tracks";
import { TracksService } from "./service";
import {
  zListTracksInput,
  zTrackIdInput,
  zCreateTrackInput,
  zUpdateTrackInput,
  zAddVersionInput,
  zUpdateVersionInput,
  zReorderVersionsInput,
} from "./dto";

export const tracksRouter = {
  versionTypes: publicProcedure.handler(() => Array.from(versionTypes)),
  list: publicProcedure.input(zListTracksInput).handler(async ({ input }) => TracksService.list(input)),

  byId: publicProcedure.input(zTrackIdInput).handler(async ({ input }) => TracksService.byId(input)),

  create: adminProcedure.input(zCreateTrackInput).handler(async ({ input }) => TracksService.create(input)),

  update: adminProcedure.input(zUpdateTrackInput).handler(async ({ input }) => TracksService.update(input)),

  remove: adminProcedure.input(zTrackIdInput).handler(async ({ input }) => TracksService.remove(input)),

  addVersion: adminProcedure.input(zAddVersionInput).handler(async ({ input }) => TracksService.addVersion(input)),

  updateVersion: adminProcedure.input(zUpdateVersionInput).handler(async ({ input }) => TracksService.updateVersion(input)),

  removeVersion: adminProcedure.input(zTrackIdInput).handler(async ({ input }) => TracksService.removeVersion(input)),

  reorderVersions: adminProcedure.input(zReorderVersionsInput).handler(async ({ input }) => TracksService.reorderVersions(input)),
};


