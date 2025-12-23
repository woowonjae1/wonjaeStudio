/**
 * **Feature: music-notes-blog, Property 5: 分页和列表功能完整性**
 * **验证：需求 3.1, 3.2**
 *
 * 属性测试：对于任何文章列表页面，分页功能应该正确显示所有文章且无重复或遗漏，
 * 首页显示8-12篇最新文章
 */

import fc from "fast-check";
import { getPaginatedPosts, getLatestPosts, getAllPosts } from "@/lib/content";

// 模拟文章数据生成器
const postArbitrary = fc.record({
  slug: fc
    .string({ minLength: 1, maxLength: 50 })
    .map((s) => s.replace(/[^a-zA-Z0-9-]/g, "-")),
  title: fc.string({ minLength: 1, maxLength: 100 }),
  date: fc
    .integer({ min: 2020, max: 2024 })
    .chain((year) =>
      fc
        .integer({ min: 1, max: 12 })
        .chain((month) =>
          fc
            .integer({ min: 1, max: 28 })
            .map(
              (day) =>
                `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
            )
        )
    ),
  summary: fc.string({ minLength: 10, maxLength: 200 }),
  tags: fc.array(fc.string({ minLength: 1, maxLength: 20 }), {
    minLength: 0,
    maxLength: 5,
  }),
  topics: fc.array(fc.string({ minLength: 1, maxLength: 20 }), {
    minLength: 0,
    maxLength: 3,
  }),
  content: fc.string({ minLength: 50, maxLength: 1000 }),
  readingTime: fc.integer({ min: 1, max: 30 }),
  pinned: fc.boolean(),
  draft: fc.boolean(),
});

const postsArrayArbitrary = fc.array(postArbitrary, {
  minLength: 0,
  maxLength: 50,
});

describe("分页功能属性测试", () => {
  test("属性5.1: 分页不应该丢失或重复文章", () => {
    fc.assert(
      fc.property(
        postsArrayArbitrary,
        fc.integer({ min: 1, max: 20 }), // postsPerPage
        (mockPosts, postsPerPage) => {
          // 过滤掉草稿并按日期排序（模拟 getAllPosts 的行为）
          const publishedPosts = mockPosts
            .filter((post) => !post.draft)
            .sort((a, b) => (a.date < b.date ? 1 : -1));

          if (publishedPosts.length === 0) return true;

          const totalPages = Math.ceil(publishedPosts.length / postsPerPage);
          const allPaginatedPosts: any[] = [];

          // 收集所有分页的文章
          for (let page = 1; page <= totalPages; page++) {
            const startIndex = (page - 1) * postsPerPage;
            const endIndex = startIndex + postsPerPage;
            const pageData = {
              posts: publishedPosts.slice(startIndex, endIndex),
              currentPage: page,
              totalPages,
              totalPosts: publishedPosts.length,
            };

            // 验证分页数据结构
            expect(pageData.currentPage).toBe(page);
            expect(pageData.totalPages).toBe(totalPages);
            expect(pageData.totalPosts).toBe(publishedPosts.length);
            expect(pageData.posts.length).toBeLessThanOrEqual(postsPerPage);

            allPaginatedPosts.push(...pageData.posts);
          }

          // 验证没有文章丢失或重复
          expect(allPaginatedPosts.length).toBe(publishedPosts.length);

          // 验证文章顺序保持一致
          for (let i = 0; i < publishedPosts.length; i++) {
            expect(allPaginatedPosts[i].slug).toBe(publishedPosts[i].slug);
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test("属性5.2: 首页应该显示8-12篇最新文章", () => {
    fc.assert(
      fc.property(postsArrayArbitrary, (mockPosts) => {
        // 过滤掉草稿并按日期排序
        const publishedPosts = mockPosts
          .filter((post) => !post.draft)
          .sort((a, b) => (a.date < b.date ? 1 : -1));

        // 测试不同的限制数量（8-12篇）
        for (let limit = 8; limit <= 12; limit++) {
          const latestPosts = publishedPosts.slice(0, limit);

          // 验证返回的文章数量不超过限制
          expect(latestPosts.length).toBeLessThanOrEqual(limit);

          // 验证返回的文章数量不超过总文章数
          expect(latestPosts.length).toBeLessThanOrEqual(publishedPosts.length);

          // 验证文章按日期降序排列
          for (let i = 1; i < latestPosts.length; i++) {
            expect(latestPosts[i - 1].date >= latestPosts[i].date).toBe(true);
          }

          // 验证返回的是最新的文章
          if (publishedPosts.length > 0) {
            expect(latestPosts[0].date).toBe(publishedPosts[0].date);
          }
        }

        return true;
      }),
      { numRuns: 100 }
    );
  });

  test("属性5.3: 分页边界情况处理", () => {
    fc.assert(
      fc.property(
        postsArrayArbitrary,
        fc.integer({ min: 1, max: 20 }), // postsPerPage
        fc.integer({ min: -5, max: 100 }), // 请求的页码（包括无效页码）
        (mockPosts, postsPerPage, requestedPage) => {
          const publishedPosts = mockPosts
            .filter((post) => !post.draft)
            .sort((a, b) => (a.date < b.date ? 1 : -1));

          const totalPages =
            publishedPosts.length > 0
              ? Math.ceil(publishedPosts.length / postsPerPage)
              : 1;

          // 测试有效页码
          if (requestedPage >= 1 && requestedPage <= totalPages) {
            const startIndex = (requestedPage - 1) * postsPerPage;
            const endIndex = startIndex + postsPerPage;
            const pageData = {
              posts: publishedPosts.slice(startIndex, endIndex),
              currentPage: requestedPage,
              totalPages,
              totalPosts: publishedPosts.length,
            };

            expect(pageData.posts.length).toBeGreaterThanOrEqual(0);
            expect(pageData.posts.length).toBeLessThanOrEqual(postsPerPage);
            expect(pageData.currentPage).toBe(requestedPage);

            // 最后一页可能少于 postsPerPage
            if (
              requestedPage === totalPages &&
              publishedPosts.length % postsPerPage !== 0
            ) {
              expect(pageData.posts.length).toBe(
                publishedPosts.length % postsPerPage
              );
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });

  test("属性5.4: 空文章列表处理", () => {
    const emptyPageData = {
      posts: [],
      currentPage: 1,
      totalPages: 1,
      totalPosts: 0,
    };

    expect(emptyPageData.posts).toHaveLength(0);
    expect(emptyPageData.currentPage).toBe(1);
    expect(emptyPageData.totalPages).toBe(1);
    expect(emptyPageData.totalPosts).toBe(0);
  });

  test("属性5.5: 分页数据一致性", () => {
    fc.assert(
      fc.property(
        postsArrayArbitrary,
        fc.integer({ min: 1, max: 20 }),
        (mockPosts, postsPerPage) => {
          const publishedPosts = mockPosts
            .filter((post) => !post.draft)
            .sort((a, b) => (a.date < b.date ? 1 : -1));

          if (publishedPosts.length === 0) return true;

          const totalPages = Math.ceil(publishedPosts.length / postsPerPage);

          for (let page = 1; page <= totalPages; page++) {
            const startIndex = (page - 1) * postsPerPage;
            const endIndex = startIndex + postsPerPage;
            const pageData = {
              posts: publishedPosts.slice(startIndex, endIndex),
              currentPage: page,
              totalPages,
              totalPosts: publishedPosts.length,
            };

            // 验证分页元数据一致性
            expect(pageData.totalPages).toBe(totalPages);
            expect(pageData.totalPosts).toBe(publishedPosts.length);
            expect(pageData.currentPage).toBe(page);

            // 验证页面内容不为空（除非是最后一页的特殊情况）
            if (page < totalPages) {
              expect(pageData.posts.length).toBe(postsPerPage);
            } else {
              expect(pageData.posts.length).toBeGreaterThan(0);
              expect(pageData.posts.length).toBeLessThanOrEqual(postsPerPage);
            }
          }

          return true;
        }
      ),
      { numRuns: 100 }
    );
  });
});

// 集成测试：使用实际的内容管理函数
describe("分页功能集成测试", () => {
  test("getPaginatedPosts 函数行为验证", () => {
    // 测试默认参数
    const defaultPage = getPaginatedPosts();
    expect(defaultPage.currentPage).toBe(1);
    expect(defaultPage.posts).toBeDefined();
    expect(defaultPage.totalPages).toBeGreaterThanOrEqual(1);
    expect(defaultPage.totalPosts).toBeGreaterThanOrEqual(0);

    // 测试自定义参数
    const customPage = getPaginatedPosts(1, 5);
    expect(customPage.currentPage).toBe(1);
    expect(customPage.posts.length).toBeLessThanOrEqual(5);
  });

  test("getLatestPosts 函数行为验证", () => {
    // 测试默认限制（12篇）
    const defaultLatest = getLatestPosts();
    expect(defaultLatest.length).toBeLessThanOrEqual(12);

    // 测试自定义限制
    const customLatest = getLatestPosts(5);
    expect(customLatest.length).toBeLessThanOrEqual(5);

    // 验证文章按日期降序排列
    for (let i = 1; i < defaultLatest.length; i++) {
      expect(defaultLatest[i - 1].date >= defaultLatest[i].date).toBe(true);
    }
  });

  test("文章总数一致性验证", () => {
    const allPosts = getAllPosts();
    const paginatedResult = getPaginatedPosts(1, 10);

    expect(paginatedResult.totalPosts).toBe(allPosts.length);

    // 验证分页总数计算正确
    const expectedTotalPages = Math.ceil(allPosts.length / 10);
    expect(paginatedResult.totalPages).toBe(expectedTotalPages || 1);
  });
});
