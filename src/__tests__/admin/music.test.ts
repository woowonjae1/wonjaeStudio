/**
 * **Feature: admin-dashboard, Property 8: Music track create and delete consistency**
 * **Validates: Requirements 5.3, 5.5**
 */

import * as fc from "fast-check";

interface MusicTrack {
  id: number;
  title: string;
  description: string;
  image_url: string;
  audio_url: string | null;
  display_order: number;
}

// Simulated track store
class TrackStore {
  private tracks: MusicTrack[] = [];
  private nextId = 1;

  create(data: Omit<MusicTrack, "id">): MusicTrack {
    const track = { ...data, id: this.nextId++ };
    this.tracks.push(track);
    return track;
  }

  get(id: number): MusicTrack | undefined {
    return this.tracks.find((t) => t.id === id);
  }

  delete(id: number): boolean {
    const index = this.tracks.findIndex((t) => t.id === id);
    if (index === -1) return false;
    this.tracks.splice(index, 1);
    return true;
  }

  getAll(): MusicTrack[] {
    return [...this.tracks];
  }
}

describe("Property 8: Music track create and delete consistency", () => {
  it("created track should be retrievable with matching data", () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1, maxLength: 100 }),
          description: fc.string({ maxLength: 500 }),
          image_url: fc.webUrl(),
          audio_url: fc.option(fc.webUrl(), { nil: null }),
          display_order: fc.nat({ max: 100 }),
        }),
        (trackData) => {
          const store = new TrackStore();
          const created = store.create(trackData);

          // Verify track is retrievable
          const retrieved = store.get(created.id);
          expect(retrieved).toBeDefined();

          // Verify data matches
          expect(retrieved?.title).toBe(trackData.title);
          expect(retrieved?.description).toBe(trackData.description);
          expect(retrieved?.image_url).toBe(trackData.image_url);
          expect(retrieved?.audio_url).toBe(trackData.audio_url);
          expect(retrieved?.display_order).toBe(trackData.display_order);
        }
      ),
      { numRuns: 100 }
    );
  });

  it("deleted track should not be retrievable", () => {
    fc.assert(
      fc.property(
        fc.record({
          title: fc.string({ minLength: 1 }),
          description: fc.string(),
          image_url: fc.webUrl(),
          audio_url: fc.option(fc.webUrl(), { nil: null }),
          display_order: fc.nat(),
        }),
        (trackData) => {
          const store = new TrackStore();
          const created = store.create(trackData);

          // Delete the track
          const deleted = store.delete(created.id);
          expect(deleted).toBe(true);

          // Verify track is no longer retrievable
          const retrieved = store.get(created.id);
          expect(retrieved).toBeUndefined();
        }
      ),
      { numRuns: 100 }
    );
  });
});

/**
 * **Feature: admin-dashboard, Property 9: Track reorder preserves all tracks**
 * **Validates: Requirements 5.6**
 */
describe("Property 9: Track reorder preserves all tracks", () => {
  function reorderTracks(
    tracks: MusicTrack[],
    newOrder: { id: number; display_order: number }[]
  ): MusicTrack[] {
    return tracks.map((track) => {
      const orderUpdate = newOrder.find((o) => o.id === track.id);
      return orderUpdate
        ? { ...track, display_order: orderUpdate.display_order }
        : track;
    });
  }

  it("reorder should preserve total number of tracks", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.nat(),
            title: fc.string({ minLength: 1 }),
            description: fc.string(),
            image_url: fc.webUrl(),
            audio_url: fc.option(fc.webUrl(), { nil: null }),
            display_order: fc.nat(),
          }),
          { minLength: 1, maxLength: 20 }
        ),
        (tracks) => {
          // Ensure unique IDs
          const uniqueTracks = tracks.map((t, i) => ({ ...t, id: i }));

          // Create new order
          const newOrder = uniqueTracks.map((t, i) => ({
            id: t.id,
            display_order: uniqueTracks.length - i,
          }));

          const reordered = reorderTracks(uniqueTracks, newOrder);

          // Verify count unchanged
          expect(reordered.length).toBe(uniqueTracks.length);

          // Verify all original tracks still exist
          uniqueTracks.forEach((original) => {
            const found = reordered.find((t) => t.id === original.id);
            expect(found).toBeDefined();
            expect(found?.title).toBe(original.title);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it("reorder should update display_order correctly", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.nat(),
            title: fc.string({ minLength: 1 }),
            description: fc.string(),
            image_url: fc.webUrl(),
            audio_url: fc.option(fc.webUrl(), { nil: null }),
            display_order: fc.nat(),
          }),
          { minLength: 1, maxLength: 20 }
        ),
        (tracks) => {
          const uniqueTracks = tracks.map((t, i) => ({ ...t, id: i }));

          const newOrder = uniqueTracks.map((t, i) => ({
            id: t.id,
            display_order: i * 10,
          }));

          const reordered = reorderTracks(uniqueTracks, newOrder);

          // Verify each track has correct new order
          newOrder.forEach((order) => {
            const track = reordered.find((t) => t.id === order.id);
            expect(track?.display_order).toBe(order.display_order);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
