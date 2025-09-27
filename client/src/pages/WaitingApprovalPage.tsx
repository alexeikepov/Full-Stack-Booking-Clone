import { Link } from "react-router-dom";

export default function WaitingApprovalPage() {
  return (
    <div className="min-h-screen grid place-items-center bg-[#f7f7f9]">
      <div className="w-[560px] max-w-[92vw] rounded-[12px] border border-[#e6eaf0] bg-white p-6 text-center">
        <div className="text-[20px] font-semibold text-[#1f2937]">Your admin request is being reviewed</div>
        <p className="mt-2 text-[13px] leading-6 text-[#4b5563]">
          Thanks for creating a partner account. Your request to become a hotel admin is pending approval by the platform owner.
          We'll notify you once it's approved.
        </p>
        <div className="mt-4 text-[13px] text-[#4b5563]">
          You can go back to the homepage or sign out and return later.
        </div>
        <div className="mt-5 flex justify-center gap-3">
          <Link to="/" className="rounded border px-3 py-2 text-[13px]">Home</Link>
          <Link to="/login" className="rounded bg-[#0071c2] px-4 py-2 text-[13px] text-white">Sign out</Link>
        </div>
      </div>
    </div>
  );
}


