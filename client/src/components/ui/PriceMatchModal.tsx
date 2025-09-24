import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { X, Check } from "lucide-react";

interface PriceMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function PriceMatchModal({
  isOpen,
  onClose,
}: PriceMatchModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-gray-900 text-left">
            We Price Match
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-left">
          {/* Main Introductory Text */}
          <div className="space-y-3">
            <p className="font-bold text-gray-900 text-base">
              You can claim a refund for the difference if you happen to find
              your reservation cheaper on another website.
            </p>
            <p className="text-gray-900 text-sm">
              Just remember to contact us after booking with us. If you file
              your We Price Match claim via email, you'll need to provide us
              with a screenshot and a link to the other offer. You can also file
              a We Price Match claim directly on the phone by reaching out to
              our Customer Service. In any case, the other offer must be online
              and available when we check.
            </p>
          </div>

          {/* Two column layout for checklist and restrictions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* We Price Match checklist - Left column */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-base">
                We Price Match checklist
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-gray-900">
                    The other offer must be for the same property and
                    accommodation type.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-gray-900">
                    The other offer must be for the same check in and check out
                    dates.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-gray-900">
                    The other offer must have the same cancellation policy and
                    conditions.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-gray-900">
                    The other offer must be for the same number of occupants
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-gray-900">
                    The other offer must have the same add-on / meal plan.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-gray-900">
                    The better deal must be in the local currency of the
                    property.
                  </p>
                </div>
              </div>
            </div>

            {/* When can't you make a claim? - Right column */}
            <div className="space-y-3">
              <h3 className="font-bold text-gray-900 text-lg">
                When can't you make a claim?
              </h3>
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-gray-900">
                    If the other offer is on a website that doesn't reveal the
                    property or accommodation type you'll be staying in until
                    after booking.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-gray-900">
                    If the other offer is available on an opaque, suspicious
                    and/or likely to be fraudulent website.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-gray-900">
                    If the other offer is part of a loyalty or rewards program,
                    where the price is reduced by the property or website for
                    actions like repeat business, logging in, using a coupon
                    code, referring others, or any other action that reduces the
                    original price.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-gray-900">
                    If your current Booking.com reservation is a 'Partner offer'
                    (these are labelled as such on our platform and are provided
                    by partner companies) or if you're comparing the other offer
                    to a 'Partner Offer' on our platform.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-gray-900">If you cancel your booking.</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-gray-900">
                    If you book a single-unit property, which by nature cannot
                    be available elsewhere.
                  </p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  <p className="text-gray-900">
                    Booking.com reserves the right to make the sole
                    determination regarding a customer's eligibility to receive
                    the price match.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Found your booking cheaper elsewhere? */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
            <h3 className="font-bold text-gray-900 text-lg">
              Found your booking cheaper elsewhere?
            </h3>
            <div className="space-y-2">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 mt-2"></div>
                <p className="text-gray-900">
                  Look for 'Found this room cheaper elsewhere?' on your
                  confirmation page.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 mt-2"></div>
                <p className="text-gray-900">
                  Validate that the cheaper offer meets all the requirements
                  (review checklist).
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 mt-2"></div>
                <p className="text-gray-900">
                  Save the link to the cheaper offer (Example:
                  www.hotel.com/93203920).
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 mt-2"></div>
                <p className="text-gray-900">
                  Take a screenshot (or multiple) making sure all the relevant
                  data is captured (review checklist).
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 mt-2"></div>
                <p className="text-gray-900">Contact Customer Service.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 mt-2"></div>
                <p className="text-gray-900">
                  After claim validation, we will amend the reservation price
                  (if possible) or provide further instruction for you to claim
                  an after stay refund of the price difference.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-gray-400 rounded-full flex-shrink-0 mt-2"></div>
                <p className="text-gray-900">
                  Booking.com reserves the right to make the sole determination
                  regarding a customer's eligibility to receive the price match.
                </p>
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="pt-4">
            <Button
              onClick={onClose}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
