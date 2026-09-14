export function HeroGlow() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="from-basement-orange to-basement-black absolute top-[35%] left-1/2 h-[75%] w-[220vw] -translate-x-1/2 rounded-[50%] bg-linear-to-b to-60% blur-[30px] lg:h-[104%] lg:w-[115vw] lg:blur-[50px]" />
      <div className="bg-noise absolute inset-0 opacity-25" />
    </div>
  );
}
