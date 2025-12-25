import { NextRequest, NextResponse } from "next/server";
import { searchPosts } from "@/lib/content";
import { formatDate } from "@/lib/markdown";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q") || "";

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  try {
    const posts = searchPosts(query);

    const results = posts.slice(0, 10).map((post) => ({
      slug: post.slug,
      title: post.title,
      summary:
        post.summary.length > 120
          ? post.summary.substring(0, 120) + "..."
          : post.summary,
      tags: post.tags,
      date: formatDate(post.date),
      type: determineMatchType(post, query),
    }));

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { results: [], error: "Search failed" },
      { status: 500 }
    );
  }
}

function determineMatchType(
  post: { title: string; content: string; tags: string[] },
  query: string
): "title" | "content" | "tag" {
  const lowerQuery = query.toLowerCase();

  if (post.title.toLowerCase().includes(lowerQuery)) {
    return "title";
  }

  if (post.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))) {
    return "tag";
  }

  return "content";
}
