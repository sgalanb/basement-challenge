import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-[#2A2A2A] font-sans">
      <main className="flex flex-col gap-10">
        <div className="flex flex-col gap-2">
          <span>Primary Dark</span>
          <Button variant="primaryDark">contact us</Button>
        </div>

        <div className="flex flex-col gap-2">
          <span>Primary Light</span>
          <Button variant="primaryLight">contact us</Button>
        </div>

        <div className="flex flex-col gap-2">
          <span>Secondary Dark</span>
          <Button variant="secondaryDark">contact us</Button>
        </div>

        <div className="flex flex-col gap-2">
          <span>Secondary Light</span>
          <Button variant="secondaryLight">contact us</Button>
        </div>

        <div className="flex flex-col gap-2">
          <span>Secondary Grey</span>
          <Button variant="secondaryGrey">contact us</Button>
        </div>
      </main>
    </div>
  );
}
