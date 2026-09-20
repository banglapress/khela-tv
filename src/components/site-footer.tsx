import { Link } from "@tanstack/react-router";
import { CATEGORIES, navCategories } from "@/lib/categories";
import { toBanglaDigits } from "@/lib/bangla";
import { FACEBOOK_URL, SITE_ADDRESS, SITE_EDITOR, SITE_EMAIL, SITE_NAME, SITE_NAME_BN, SITE_PHONE, SITE_TAGLINE, YOUTUBE_URL } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="mt-14 border-t-2 border-foreground bg-secondary">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <span className="font-serif text-2xl font-bold">{SITE_NAME_BN}</span>
          <p className="mt-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">{SITE_NAME}</p>
          <p className="mt-2 max-w-xs text-sm text-muted-foreground">{SITE_TAGLINE}</p>
        </div>
        <div>
          <h4 className="section-rule mb-3 pb-1 text-sm font-bold">বিভাগ</h4>
          <div className="grid grid-cols-2 gap-y-1 text-sm">
            {navCategories(CATEGORIES).map((c) => (
              <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="hover:text-primary">
                {c.name}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="section-rule mb-3 pb-1 text-sm font-bold">যোগাযোগ</h4>
          <div className="space-y-1 text-sm text-muted-foreground">
            <p>সম্পাদক: <span className="text-foreground">{SITE_EDITOR}</span></p>
            <p>{SITE_ADDRESS}</p>
            <p>ইমেইল: <a href={`mailto:${SITE_EMAIL}`} className="hover:text-primary">{SITE_EMAIL}</a></p>
            <p>ফোন: <a href={`tel:${SITE_PHONE}`} className="hover:text-primary">{SITE_PHONE}</a></p>
            <p className="pt-2">
              <a href={FACEBOOK_URL} target="_blank" rel="noreferrer" className="mr-4 font-medium text-primary hover:underline">Facebook</a>
              <a href={YOUTUBE_URL} target="_blank" rel="noreferrer" className="font-medium text-primary hover:underline">YouTube</a>
            </p>
          </div>
          <Link to="/auth" className="mt-3 inline-block text-sm text-primary hover:underline">সম্পাদকীয় প্রবেশ</Link>
        </div>
      </div>
      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        © {toBanglaDigits(new Date().getFullYear())} {SITE_NAME} / {SITE_NAME_BN} — সর্বস্বত্ব সংরক্ষিত
      </div>
    </footer>
  );
}
