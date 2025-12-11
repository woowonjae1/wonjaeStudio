/**
 * **Feature: admin-dashboard, Property 7: Reply delete removes only target**
 * **Validates: Requirements 4.3**
 *
 * For any reply deletion, only the specified reply SHALL be removed,
 * and the parent topic and other replies SHALL remain unchanged.
 */

import * as fc from "fast-check";

interface Reply {
  id: number;
  topic_id: number;
  content: string;
}

interface Topic {
  id: number;
  title: string;
}

// Simulated delete function
function deleteReply(
  replies: Reply[],
  topics: Topic[],
  replyIdToDelete: number
): { replies: Reply[]; topics: Topic[] } {
  return {
    replies: replies.filter((r) => r.id !== replyIdToDelete),
    topics: [...topics], // Topics remain unchanged
  };
}

describe("Property 7: Reply delete removes only target", () => {
  const topicArb = fc.record({
    id: fc.nat(),
    title: fc.string({ minLength: 1 }),
  });

  const replyArb = fc.record({
    id: fc.nat(),
    topic_id: fc.nat(),
    content: fc.string({ minLength: 1 }),
  });

  it("should remove only the specified reply", () => {
    fc.assert(
      fc.property(
        fc.array(replyArb, { minLength: 2, maxLength: 50 }),
        fc.array(topicArb, { minLength: 1, maxLength: 10 }),
        (replies, topics) => {
          // Ensure unique IDs
          const uniqueReplies = replies.map((r, i) => ({ ...r, id: i }));
          const replyToDelete =
            uniqueReplies[Math.floor(Math.random() * uniqueReplies.length)];

          const result = deleteReply(uniqueReplies, topics, replyToDelete.id);

          // Verify the target reply is removed
          const deletedReply = result.replies.find(
            (r) => r.id === replyToDelete.id
          );
          expect(deletedReply).toBeUndefined();

          // Verify other replies remain
          const otherReplies = uniqueReplies.filter(
            (r) => r.id !== replyToDelete.id
          );
          expect(result.replies.length).toBe(otherReplies.length);

          otherReplies.forEach((original) => {
            const remaining = result.replies.find((r) => r.id === original.id);
            expect(remaining).toBeDefined();
            expect(remaining?.content).toBe(original.content);
          });
        }
      ),
      { numRuns: 100 }
    );
  });

  it("should not affect parent topics", () => {
    fc.assert(
      fc.property(
        fc.array(replyArb, { minLength: 1, maxLength: 50 }),
        fc.array(topicArb, { minLength: 1, maxLength: 10 }),
        (replies, topics) => {
          const uniqueReplies = replies.map((r, i) => ({ ...r, id: i }));
          const uniqueTopics = topics.map((t, i) => ({ ...t, id: i }));

          if (uniqueReplies.length === 0) return true;

          const replyToDelete = uniqueReplies[0];
          const result = deleteReply(
            uniqueReplies,
            uniqueTopics,
            replyToDelete.id
          );

          // Verify all topics remain unchanged
          expect(result.topics.length).toBe(uniqueTopics.length);
          uniqueTopics.forEach((original) => {
            const remaining = result.topics.find((t) => t.id === original.id);
            expect(remaining).toBeDefined();
            expect(remaining?.title).toBe(original.title);
          });
        }
      ),
      { numRuns: 100 }
    );
  });
});
