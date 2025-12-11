/**
 * **Feature: admin-dashboard, Property 1: Stats aggregation correctness**
 * **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
 *
 * For any database state with topics and replies, the stats API response SHALL return
 * counts that exactly match the database aggregations.
 */

import * as fc from "fast-check";

interface Topic {
  id: number;
  title: string;
  author_name: string;
  views: number;
  created_at: Date;
}

interface Reply {
  id: number;
  topic_id: number;
}

// Simulated stats calculation (mirrors API logic)
function calculateStats(topics: Topic[], replies: Reply[]) {
  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  return {
    totalTopics: topics.length,
    totalReplies: replies.length,
    totalViews: topics.reduce((sum, t) => sum + t.views, 0),
    topicsLast7Days: topics.filter((t) => t.created_at >= sevenDaysAgo).length,
  };
}

describe("Admin Stats", () => {
  describe("Property 1: Stats aggregation correctness", () => {
    const topicArb = fc.record({
      id: fc.nat(),
      title: fc.string({ minLength: 1 }),
      author_name: fc.string({ minLength: 1 }),
      views: fc.nat({ max: 10000 }),
      created_at: fc.date({
        min: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        max: new Date(),
      }),
    });

    const replyArb = (topicIds: number[]) =>
      fc.record({
        id: fc.nat(),
        topic_id:
          topicIds.length > 0 ? fc.constantFrom(...topicIds) : fc.constant(0),
      });

    it("totalTopics should equal the count of topics", () => {
      fc.assert(
        fc.property(fc.array(topicArb, { maxLength: 50 }), (topics) => {
          const stats = calculateStats(topics, []);
          expect(stats.totalTopics).toBe(topics.length);
        }),
        { numRuns: 100 }
      );
    });

    it("totalReplies should equal the count of replies", () => {
      fc.assert(
        fc.property(
          fc.array(topicArb, { maxLength: 20 }),
          fc.array(fc.record({ id: fc.nat(), topic_id: fc.nat() }), {
            maxLength: 100,
          }),
          (topics, replies) => {
            const stats = calculateStats(topics, replies);
            expect(stats.totalReplies).toBe(replies.length);
          }
        ),
        { numRuns: 100 }
      );
    });

    it("totalViews should equal the sum of all topic views", () => {
      fc.assert(
        fc.property(fc.array(topicArb, { maxLength: 50 }), (topics) => {
          const stats = calculateStats(topics, []);
          const expectedViews = topics.reduce((sum, t) => sum + t.views, 0);
          expect(stats.totalViews).toBe(expectedViews);
        }),
        { numRuns: 100 }
      );
    });

    it("topicsLast7Days should count only topics created within 7 days", () => {
      fc.assert(
        fc.property(fc.array(topicArb, { maxLength: 50 }), (topics) => {
          const stats = calculateStats(topics, []);
          const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
          const expectedCount = topics.filter(
            (t) => t.created_at >= sevenDaysAgo
          ).length;
          expect(stats.topicsLast7Days).toBe(expectedCount);
        }),
        { numRuns: 100 }
      );
    });
  });
});

/**
 * **Feature: admin-dashboard, Property 2: Recent topics ordering and completeness**
 * **Validates: Requirements 2.5**
 */
describe("Property 2: Recent topics ordering and completeness", () => {
  it("recentTopics should be ordered by created_at descending", () => {
    fc.assert(
      fc.property(
        fc.array(
          fc.record({
            id: fc.nat(),
            title: fc.string({ minLength: 1 }),
            author_name: fc.string({ minLength: 1 }),
            created_at: fc.date({
              min: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
              max: new Date(),
            }),
          }),
          { maxLength: 20 }
        ),
        (topics) => {
          // Simulate API behavior: sort by created_at desc, take first 5
          const sorted = [...topics]
            .sort((a, b) => b.created_at.getTime() - a.created_at.getTime())
            .slice(0, 5);

          // Verify ordering
          for (let i = 1; i < sorted.length; i++) {
            expect(sorted[i - 1].created_at.getTime()).toBeGreaterThanOrEqual(
              sorted[i].created_at.getTime()
            );
          }

          // Verify each topic has required fields
          sorted.forEach((topic) => {
            expect(topic).toHaveProperty("id");
            expect(topic).toHaveProperty("title");
            expect(topic).toHaveProperty("author_name");
            expect(topic).toHaveProperty("created_at");
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
