import { AlbumsRepository as Repo } from "./repository";
import type { CreateAlbumInput, ListAlbumsInput } from "./dto";

export const AlbumsService = {
  async list(input: ListAlbumsInput) {
    const like = input.query ? `%${input.query}%` : undefined;
    return Repo.list({ like, limit: input.limit, offset: input.offset });
  },

  async create(input: CreateAlbumInput) {
    return Repo.insert({ title: input.title, coverUrl: input.coverUrl });
  },
};


