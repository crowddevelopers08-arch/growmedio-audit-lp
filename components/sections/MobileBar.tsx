import BookNowButton from "@/components/booking/BookNowButton";

export default function MobileBar() {
  return (
    <>
      {/* Reserves the bar's height at the end of the page, so the fixed bar
          never covers the footer — and pages without the bar get no gap. */}
      <div aria-hidden="true" className="h-[calc(4.25rem+env(safe-area-inset-bottom))] min-[900px]:hidden" />

      <div className="fixed right-0 bottom-0 left-0 z-[90] flex items-center justify-between gap-3 border-t border-line-strong bg-[rgba(10,12,16,0.92)] px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-[14px] min-[900px]:hidden">
        <span className="min-w-0 leading-tight">
          <b className="block truncate text-[0.95rem] font-bold text-brand min-[380px]:text-[1.05rem]">
            Strategy Session
          </b>
          <span className="text-[0.8rem] text-dim">
            ₹199 <span className="text-faint line-through">₹2,999</span>
          </span>
        </span>
        <BookNowButton size="sm" className="shrink-0">
          Book Now
        </BookNowButton>
      </div>
    </>
  );
}
