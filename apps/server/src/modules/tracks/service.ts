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

    const rows = await Repo.listWithDetails({ 
      where, 
      limit: input.limit, 
      offset: input.offset, 
      sortDir: input.sortDir, 
      sortBy: input.sortBy 
    });
    
    if (rows.length === 0) {
      return { items: [] };
    }

    const tracksMap = new Map<number, {
      id: number;
      title: string;
      artists: string[];
      producers: string[];
      createdAt: Date;
      alternateTitles: string[];
      album: {
        id: number;
        title: string;
        coverUrl: string;
      };
      versions: Array<{
        id: number;
        type: string;
        title: string;
        artists: string[];
        fileUrl: string;
        orderIndex: number;
        createdAt: Date;
      }>;
    }>();
    
    for (const row of rows) {
      const trackId = row.trackId;
      
      if (!tracksMap.has(trackId)) {
        tracksMap.set(trackId, {
          id: trackId,
          title: row.trackTitle,
          artists: row.trackArtists,
          producers: row.trackProducers,
          createdAt: row.trackCreatedAt,
          alternateTitles: row.trackAlternateTitles,
          album: {
            id: row.albumId!,
            title: row.albumTitle!,
            coverUrl: row.albumCoverUrl!,
          },
          versions: [],
        });
      }
      
      if (row.versionId) {
        tracksMap.get(trackId)!.versions.push({
          id: row.versionId,
          type: row.versionType!,
          title: row.versionTitle!,
          artists: row.versionArtists!,
          fileUrl: row.versionFileUrl!,
          orderIndex: row.versionOrderIndex!,
          createdAt: row.versionCreatedAt!,
        });
      }
    }

    const items = Array.from(tracksMap.values())
      .filter(track => track.versions.length > 0)
      .map(track => ({
        ...track,
        versions: track.versions.sort((a, b) => a.orderIndex - b.orderIndex)
      }));
    
    return { items };
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


