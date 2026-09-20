export type SiteCategory = {
  id?: string;
  name: string;
  slug: string;
  parent_id?: string | null;
  show_in_nav?: boolean;
  nav_order?: number;
  sort_order?: number;
};

export const DEFAULT_CATEGORY_SLUG = "cricket";

export const CATEGORIES: SiteCategory[] = [
  { name: "ক্রিকেট", slug: "cricket", show_in_nav: true, nav_order: 1, sort_order: 1 },
  { name: "ফুটবল", slug: "football", show_in_nav: true, nav_order: 2, sort_order: 2 },
  { name: "টেনিস", slug: "tennis", show_in_nav: true, nav_order: 3, sort_order: 3 },
  { name: "অ্যাথলেটিক্স", slug: "athletics", show_in_nav: true, nav_order: 4, sort_order: 4 },
  { name: "বাস্কেটবল", slug: "basketball", show_in_nav: true, nav_order: 5, sort_order: 5 },
  { name: "হকি", slug: "hockey", show_in_nav: true, nav_order: 6, sort_order: 6 },
  { name: "অন্যান্য খেলা", slug: "other-sports", show_in_nav: true, nav_order: 7, sort_order: 7 },
  { name: "বিশ্লেষণ", slug: "analysis", show_in_nav: true, nav_order: 8, sort_order: 8 },
  { name: "বাংলাদেশ ক্রিকেট", slug: "cricket-bangladesh", show_in_nav: false, nav_order: 11, sort_order: 11 },
  { name: "আন্তর্জাতিক ক্রিকেট", slug: "cricket-international", show_in_nav: false, nav_order: 12, sort_order: 12 },
  { name: "আইপিএল", slug: "ipl", show_in_nav: false, nav_order: 13, sort_order: 13 },
  { name: "বিপিএল", slug: "bpl", show_in_nav: false, nav_order: 14, sort_order: 14 },
  { name: "বাংলাদেশ ফুটবল", slug: "football-bangladesh", show_in_nav: false, nav_order: 21, sort_order: 21 },
  { name: "আন্তর্জাতিক ফুটবল", slug: "football-international", show_in_nav: false, nav_order: 22, sort_order: 22 },
];

export const RESERVED_SECTIONS = ["admin", "auth", "search", "news", "category", "login", "api", "writer"];

export function categoryName(slug: string, list: SiteCategory[] = CATEGORIES): string {
  return list.find((c) => c.slug === slug)?.name ?? slug;
}

export function navCategories(list: SiteCategory[] = CATEGORIES): SiteCategory[] {
  return list
    .filter((c) => c.show_in_nav !== false && !c.parent_id)
    .sort((a, b) => (a.nav_order ?? 0) - (b.nav_order ?? 0));
}

export function childCategories(parentSlug: string, list: SiteCategory[] = CATEGORIES): SiteCategory[] {
  const parent = list.find((c) => c.slug === parentSlug);
  if (!parent?.id) {
    const implied = list.filter(
      (c) =>
        c.slug.startsWith(`${parentSlug}-`) ||
        (["ipl", "bpl"].includes(c.slug) && parentSlug === "cricket"),
    );
    return implied.filter((c) => c.slug !== parentSlug);
  }
  return list.filter((c) => c.parent_id === parent.id);
}
