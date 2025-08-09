import { TracksRepository as Repo } from "./repository";
import type {
  AddVersionInput,
  CreateTrackInput,
  ListTracksInput,
  ReorderVersionsInput,
  TrackIdInput,
  UpdateTrackInput,
  UpdateVersionInput,
} from "./dto";

export const TracksService = {
  async list(input: ListTracksInput) {
    const whereSearch = await Repo.searchWhereClause(input.query);
    const where = await Repo.filterByVersionType(whereSearch, input.versionType);

    const rows = await Repo.list({ where, limit: input.limit, offset: input.offset, sortDir: input.sortDir, sortBy: input.sortBy });
    if (rows.length === 0) {
      return { items: [] } as const;
    }
    const [versions, albumsRows] = await Promise.all([
      Repo.listVersionsByTrackIds(rows.map((r) => r.id)),
      Repo.listAlbumsByIds(rows.map((r) => r.albumId)),
    ]);
    const albumById = new Map(albumsRows.map((a) => [a.id, a]));

    const items = rows.map((t) => ({
      id: t.id,
      title: t.title,
      artists: t.artists,
      producers: t.producers,
      createdAt: t.createdAt,
      alternateTitles: t.alternateTitles,
      albumId: t.albumId,
      album: albumById.get(t.albumId) ?? null,
      versions: versions.filter((v) => v.trackId === t.id),
    }));
    return { items } as const;
  },

  async byId(input: TrackIdInput) {
    const row = await Repo.findById(input.id);
    if (!row) return null;
    const vers = await Repo.listVersionsByTrackId(input.id);
    const album = await Repo.findAlbumById(row.albumId);
    return { ...row, album: album ?? null, versions: vers };
  },

  async create(input: CreateTrackInput) {
    const firstVersion = input.versions[0];
    const derivedTitle = input.title ?? firstVersion?.title ?? "Untitled";
    const derivedArtists = input.artists ?? Array.from(new Set(input.versions.flatMap((v) => v.artists)));

    const track = await Repo.insertTrack({
      albumId: input.albumId,
      alternateTitles: input.alternateTitles,
      title: derivedTitle,
      artists: derivedArtists,
      producers: input.producers,
    } as any);
    const values = input.versions.map((v, idx) => ({
      trackId: track.id,
      type: v.type,
      title: v.title,
      artists: v.artists,
      fileUrl: v.fileUrl,
      orderIndex: idx,
    }));
    await Repo.insertVersions(values);
    return track;
  },

  async update(input: UpdateTrackInput) {
    await Repo.updateTrack(input.id, { albumId: input.albumId, alternateTitles: input.alternateTitles });
    const updated = await Repo.findById(input.id);
    if (!updated) throw new Error("Not found");
    return updated;
  },

  async remove(input: TrackIdInput) {
    await Repo.deleteTrackWithVersions(input.id);
    return { ok: true } as const;
  },

  async addVersion(input: AddVersionInput) {
    const nextIndex = (await Repo.maxOrderIndexForTrack(input.trackId)) + 1;
    const inserted = await Repo.insertVersion({
      trackId: input.trackId,
      type: input.type,
      title: input.title,
      artists: input.artists,
      fileUrl: input.fileUrl,
      orderIndex: nextIndex,
    });
    const versions = await Repo.listVersionsByTrackId(input.trackId);
    const primary = versions[0];
    if (primary) {
      const dedupArtists = Array.from(new Set(versions.flatMap((v) => v.artists)));
      await Repo.updateTrack(input.trackId, { title: primary.title, artists: dedupArtists });
    }
    return inserted;
  },

  async updateVersion(input: UpdateVersionInput) {
    await Repo.updateVersion(input.id, { type: input.type, title: input.title, artists: input.artists, fileUrl: input.fileUrl });
    const versions = await Repo.listVersionsByTrackId(input.id);
    const updated = versions.find((v) => v.id === input.id);
    if (!updated) throw new Error("Not found");
    return updated;
  },

  async removeVersion(input: TrackIdInput) {
    await Repo.deleteVersion(input.id);
    return { ok: true } as const;
  },

  async reorderVersions(input: ReorderVersionsInput) {
    await Promise.all(input.orderedIds.map((id, idx) => Repo.updateVersion(id, { orderIndex: idx })));
    return Repo.listVersionsByTrackId(input.trackId);
  },
};


