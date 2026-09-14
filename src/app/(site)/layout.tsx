import Footer from "@/components/footer";
import NavBar from "@/components/nav-bar";
import { PreviousPathnameTracker } from "@/components/previous-pathname";
import { SkipLink } from "@/components/skip-link";
import { sanityFetch } from "@/modules/sanity/lib/live";
import { LAYOUT_QUERY } from "@/modules/sanity/lib/queries";
import { TAGS } from "@/modules/sanity/lib/tags";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const { data: layout } = await sanityFetch({ query: LAYOUT_QUERY, tags: [TAGS.layout] });

  return (
    <>
      <PreviousPathnameTracker />
      <SkipLink />
      <NavBar links={layout?.navLinks ?? []} ctas={layout?.navCtas ?? []} />
      {children}
      <Footer columns={layout?.footerColumns ?? []} copyright={layout?.copyrightText ?? null} />
    </>
  );
}
