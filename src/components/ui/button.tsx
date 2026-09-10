import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const primaryBase = "h-9 gap-2 rounded-lg px-8 py-2";
const primaryInnerGlow =
  "shadow-[inset_0_1px_2px_rgba(255,255,255,0.1),inset_0_-1px_2px_rgba(255,255,255,0.1)]";
const primaryGradientDark =
  "[background-image:radial-gradient(50%_100%_at_50%_100%,rgba(190,190,190,0.3)_0%,rgba(190,190,190,0)_100%)]";
const primaryGradientLight =
  "[background-image:radial-gradient(50%_100%_at_50%_100%,rgba(0,0,0,0.3)_0%,rgba(0,0,0,0)_100%)]";

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap select-none focus-visible:outline-2 focus-visible:outline-offset-2 uppercase typography-label w-fit cursor-pointer text-center",
  {
    variants: {
      variant: {
        primaryDark: [
          primaryBase,
          primaryInnerGlow,
          primaryGradientDark,
          "bg-basement-black text-foreground",
        ],
        primaryLight: [
          primaryBase,
          primaryInnerGlow,
          primaryGradientLight,
          "bg-[#f8f8f8] text-background",
        ],
        secondaryDark:
          "rounded-sm bg-accent text-accent-foreground py-1 px-2 leading-[round(0.9em,1px)]",
        secondaryLight:
          "rounded-sm bg-foreground text-background py-1 px-2 leading-[round(0.9em,1px)]",
        secondaryGrey: "rounded-sm bg-basement-grey py-1 px-2 leading-[round(0.9em,1px)]",
      },
    },
    defaultVariants: {
      variant: "primaryDark",
    },
  },
);

function Button({
  className,
  variant = "primaryDark",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
