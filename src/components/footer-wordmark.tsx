import { LOGO_PATH } from "@/components/logo";

const MASK_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 107 15"><path d="${LOGO_PATH}" fill="black"/></svg>`;
const WORDMARK_MASK = `url("data:image/svg+xml,${encodeURIComponent(MASK_SVG)}")`;

const BLUR_START = "20%";
const BLUR_END = "100%";

export function FooterWordmark({ className }: { className?: string }) {
  return (
    <div aria-hidden className={`relative ${className ?? ""}`}>
      <div className="relative -mx-3 aspect-107/15 w-[calc(104.3%+1.5rem)] lg:mx-0 lg:w-full">
        <div
          className="from-basement-black absolute inset-0 bg-linear-to-b from-0% to-[#4a4a4a] to-100% mask-contain mask-no-repeat"
          style={{ maskImage: WORDMARK_MASK }}
        />

        <div
          className="bg-noise absolute inset-0 mask-contain mask-no-repeat opacity-25"
          style={{ maskImage: WORDMARK_MASK }}
        />
      </div>

      <div
        className="pointer-events-none absolute -inset-x-3 top-0 -bottom-3 backdrop-blur-[3px] lg:-inset-x-6 lg:-bottom-6 lg:backdrop-blur-[6px]"
        style={{
          maskImage: `linear-gradient(to bottom, transparent ${BLUR_START}, black ${BLUR_END})`,
        }}
      />
    </div>
  );
}
