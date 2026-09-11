import BookNowButton from "@/components/booking/BookNowButton";

export default function MobileBar() {
  return (
    <div className="fixed right-0 bottom-0 left-0 z-[90] flex items-center justify-between gap-[14px] border-t border-line-strong bg-[rgba(10,12,16,0.92)] px-[18px] py-3 backdrop-blur-[14px] min-[900px]:hidden">
      <span className="text-[0.85rem] text-dim">
        ₹299 <span className="text-faint line-through">₹2,999</span>{" "}
        <b className="text-[1.05rem] font-bold text-brand">Strategy Session</b>
      </span>
      <BookNowButton size="sm">Book Now</BookNowButton>
    </div>
  );
}
