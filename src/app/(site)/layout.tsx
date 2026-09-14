import Footer from "@/components/footer";
import NavBar from "@/components/nav-bar";
import { SkipLink } from "@/components/skip-link";
import { sanityFetch } from "@/sanity/lib/live";
import { LAYOUT_QUERY } from "@/sanity/lib/queries";
import { TAGS } from "@/sanity/lib/tags";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const { data: layout } = await sanityFetch({ query: LAYOUT_QUERY, tags: [TAGS.layout] });

  return (
    <>
      <SkipLink />
      <NavBar links={layout?.navLinks ?? []} ctas={layout?.navCtas ?? []} />
      {children}
      <Footer columns={layout?.footerColumns ?? []} copyright={layout?.copyrightText ?? null} />
    </>
  );
}
