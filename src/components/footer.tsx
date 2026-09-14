import { stegaClean } from "next-sanity";
import Link from "next/link";

import { FooterWordmark } from "@/components/footer-wordmark";
import { NewTabHint } from "@/components/new-tab-hint";
import { SodaLogo } from "@/components/soda-logo";
import type { LAYOUT_QUERY_RESULT } from "@/modules/sanity/types";
import { isExternal } from "@/modules/utils";

type FooterColumnData = NonNullable<NonNullable<LAYOUT_QUERY_RESULT>["footerColumns"]>[number];
type FooterLinkData = NonNullable<FooterColumnData["links"]>[number];

export default function Footer({
  columns,
  copyright,
}: {
  columns: FooterColumnData[];
  copyright: string | null;
}) {
  return (
    <footer className="border-basement-grey w-full overflow-x-clip border-t px-3 pb-2 lg:px-6 lg:pb-0">
      <div className="mx-auto flex w-full max-w-343 flex-col rounded-b-xl pt-5 lg:pt-8 lg:pb-4">
        {columns.length > 0 && (
          <nav aria-label="Footer">
            <ul className="flex flex-wrap gap-x-6 gap-y-8 lg:gap-x-20">
              {columns.map((column) => (
                <li key={column._key} className="flex flex-col gap-4">
                  <h2 className="typography-label text-basement-orange text-xs lg:text-base">
                    {column.title}
                  </h2>
                  {column.links && column.links.length > 0 && (
                    <ul className="flex flex-col gap-2">
                      {column.links.map((link) => (
                        <li key={link._key}>
                          <FooterLink link={link} />
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        )}

        <FooterWordmark className="mt-14 mb-4 lg:mt-16 lg:mb-8" />

        <div className="text-basement-grey lg:typography-label flex items-end justify-between gap-12 text-[0.5625rem] leading-[1.2] font-medium tracking-[-0.01em] text-balance uppercase">
          {copyright && <p className="max-w-80 lg:max-w-none">{copyright}</p>}
          <a
            href="https://www.sodaspeaks.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-basement-white flex shrink-0 items-center gap-2 text-right transition-colors lg:gap-4"
          >
            Proud member of SODA
            <NewTabHint />
            <SodaLogo className="h-3 w-auto lg:h-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({ link }: { link: FooterLinkData }) {
  const href = stegaClean(link.href);
  const external = isExternal(href, link.openInNewTab);

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="typography-body-emphasized text-basement-white hover:text-basement-orange text-xs transition-colors lg:text-base"
    >
      {link.label}
      {external && <NewTabHint />}
    </Link>
  );
}
