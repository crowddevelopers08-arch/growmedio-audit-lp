export default function AnnouncementBar() {
  return (
    <div className="border-b border-line bg-[linear-gradient(90deg,#0B120F,#0E1613_60%,#0B120F)] px-4 py-[10px] text-center text-[0.85rem] text-dim">
      <span
        aria-hidden="true"
        className="mr-2 inline-block h-[7px] w-[7px] animate-blink rounded-full bg-brand"
      />
      <strong className="font-semibold text-ink">
        New 1:1 Revenue Strategy Session slots open this week
      </strong>{" "}
      — <span className="mx-1 text-faint line-through">₹2,999</span>
      <span className="font-bold text-brand">₹299</span>
    </div>
  );
}
