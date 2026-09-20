import { createFileRoute, Link } from "@tanstack/react-router";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { getHomeData } from "@/lib/news.functions";
import { ArticleCard } from "@/components/article-card";
import { CATEGORIES, navCategories } from "@/lib/categories";
import { SITE_DESCRIPTION, SITE_NAME, SITE_NAME_BN, SITE_TAGLINE } from "@/lib/site";

const homeQuery = queryOptions({
  queryKey: ["home"],
  queryFn: () => getHomeData(),
});

export const Route = createFileRoute("/")({
  loader: ({ context }) => context.queryClient.ensureQueryData(homeQuery),
  head: () => ({
    meta: [
      { title: `${SITE_NAME} — ${SITE_NAME_BN} | ${SITE_TAGLINE}` },
      { name: "description", content: SITE_DESCRIPTION },
      { property: "og:title", content: `${SITE_NAME} — ${SITE_NAME_BN}` },
      { property: "og:description", content: SITE_DESCRIPTION },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://khelatv.com/" },
      { property: "og:image", content: "https://khelatv.com/og.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Home,
});

function Home() {
  const { data } = useSuspenseQuery(homeQuery);
  const articles = data.articles;

  if (articles.length === 0) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center">
        <h1 className="font-serif text-3xl font-bold">এখনো কোনো খেলাখবর প্রকাশিত হয়নি</h1>
        <p className="mt-3 text-muted-foreground">
          সম্পাদকীয় প্যানেলে প্রবেশ করে প্রথম খবরটি প্রকাশ করুন। RSS থেকে খসড়া এলেও মানব অনুমোদন ছাড়া ওয়েবসাইট বা ফেসবুকে যাবে না।
        </p>
      </div>
    );
  }

  const lead = articles.find((a) => a.is_lead) ?? articles[0]!;
  const rest = articles.filter((a) => a.id !== lead.id);
  const secondary = rest.slice(0, 4);
  const latest = rest.slice(0, 8);
  const analysis = articles.filter((a) => a.category_slug === "analysis").slice(0, 4);
  const nav = navCategories(CATEGORIES);

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="sr-only">{SITE_NAME} — {SITE_NAME_BN}</h1>

      <div className="grid gap-8 md:grid-cols-[2fr_1fr]">
        <div>
          <ArticleCard article={lead} variant="lead" />
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {secondary.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
          </div>
        </div>

        <aside>
          <h2 className="section-rule pb-1 font-serif text-lg font-bold">সর্বশেষ</h2>
          <div>
            {latest.map((a) => (
              <ArticleCard key={a.id} article={a} variant="list" />
            ))}
          </div>

          {analysis.length > 0 && (
            <div className="mt-8 bg-secondary p-4">
              <h2 className="section-rule pb-1 font-serif text-lg font-bold">বিশ্লেষণ</h2>
              {analysis.map((a) => (
                <ArticleCard key={a.id} article={a} variant="list" />
              ))}
            </div>
          )}
        </aside>
      </div>

      {nav.map((cat) => {
        const items = articles.filter((a) => a.category_slug === cat.slug || a.category_slug.startsWith(`${cat.slug}-`)).slice(0, 3);
        if (items.length === 0) return null;
        return (
          <section key={cat.slug} className="mt-12">
            <div className="section-rule mb-4 flex items-baseline justify-between pb-1">
              <h2 className="font-serif text-xl font-bold">{cat.name}</h2>
              <Link
                to="/category/$slug"
                params={{ slug: cat.slug }}
                className="text-sm text-primary hover:underline"
              >
                সব খবর
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
