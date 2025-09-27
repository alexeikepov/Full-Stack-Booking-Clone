import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getHotelReviews, respondToReview } from "@/lib/api";
import type { Review } from "@/types/admin";

interface AdminHotelReviewsListProps {
  hotelId: string;
}

export function AdminHotelReviewsList({ hotelId }: AdminHotelReviewsListProps) {
  const queryClient = useQueryClient();
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["owner-hotel-reviews", hotelId],
    queryFn: () => getHotelReviews(hotelId, { limit: 100 }),
    retry: false,
  });

  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [editingResponseId, setEditingResponseId] = useState<string | null>(
    null
  );

  const replyMutation = useMutation({
    mutationFn: ({ reviewId, text }: { reviewId: string; text: string }) =>
      respondToReview(reviewId, text),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["owner-hotel-reviews", hotelId],
      });
    },
  });

  if (isLoading) {
    return <div className="text-sm text-gray-600">Loading reviews...</div>;
  }

  return (
    <div className="space-y-4">
      {(reviews as Review[]).map((rv: Review) => {
        const createdAt = rv.createdAt ? new Date(rv.createdAt) : null;
        const stayDate = rv.stayDate ? new Date(rv.stayDate) : null;
        const categories = rv.categoryRatings || {};
        const categoryEntries = Object.entries(categories).filter(
          ([, v]) => typeof v === "number"
        );

        return (
          <Card key={String(rv._id || rv.id)}>
            <CardContent className="p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 rounded-md bg-blue-600 text-white flex items-center justify-center font-semibold">
                      {Number(rv.rating)?.toFixed?.(1) ?? rv.rating}
                    </div>
                    <Badge variant="secondary">Rating</Badge>
                  </div>
                  <span className="font-medium">
                    {rv.guestName || rv.user?.name || "Guest"}
                    {rv.guestCountry ? ` • ${rv.guestCountry}` : ""}
                  </span>
                </div>
                <div className="text-xs text-gray-500 flex gap-3">
                  {createdAt && (
                    <span>Posted {createdAt.toLocaleDateString()}</span>
                  )}
                  {stayDate && (
                    <span>Stayed {stayDate.toLocaleDateString()}</span>
                  )}
                  {rv.roomType && <span>Room: {rv.roomType}</span>}
                  {rv.travelType && <span>Type: {rv.travelType}</span>}
                </div>
              </div>

              {(rv.comment || rv.negative) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rv.comment && (
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium mb-1">Positive</div>
                      <div className="text-sm text-gray-800 whitespace-pre-wrap">
                        {rv.comment}
                      </div>
                    </div>
                  )}
                  {rv.negative && (
                    <div className="rounded-lg border p-3">
                      <div className="text-sm font-medium mb-1">Negative</div>
                      <div className="text-sm text-gray-800 whitespace-pre-wrap">
                        {rv.negative}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {categoryEntries.length > 0 && (
                <div>
                  <div className="text-sm font-medium mb-2">
                    Category ratings
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
                    {categoryEntries.map(([key, val]) => (
                      <div
                        key={key}
                        className="bg-gray-50 rounded p-2 text-center"
                      >
                        <div className="text-xs text-gray-500 capitalize">
                          {key}
                        </div>
                        <div className="text-sm font-semibold">
                          {Number(val as number).toFixed(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {rv.hotelResponse ? (
                <div className="rounded-lg bg-green-50 border border-green-200 p-3 text-sm">
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">Hotel response</div>
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => {
                        setEditingResponseId(String(rv._id || rv.id));
                        setReplyText((m) => ({
                          ...m,
                          [String(rv._id || rv.id)]:
                            rv.hotelResponse?.text || "",
                        }));
                      }}
                    >
                      Edit
                    </Button>
                  </div>
                  {editingResponseId === String(rv._id || rv.id) ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        className="flex-1 rounded border px-2 py-1 text-sm"
                        placeholder="Edit response"
                        value={replyText[String(rv._id || rv.id)] || ""}
                        onChange={(e) =>
                          setReplyText((m) => ({
                            ...m,
                            [String(rv._id || rv.id)]: e.target.value,
                          }))
                        }
                      />
                      <Button
                        size="sm"
                        onClick={() =>
                          replyMutation.mutate(
                            {
                              reviewId: String(rv._id || rv.id),
                              text: replyText[String(rv._id || rv.id)] || "",
                            },
                            {
                              onSuccess: () => setEditingResponseId(null),
                            }
                          )
                        }
                        disabled={
                          !replyText[String(rv._id || rv.id)] ||
                          replyMutation.isPending
                        }
                      >
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingResponseId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="whitespace-pre-wrap">
                        {rv.hotelResponse.text}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {rv.hotelResponse.respondedAt
                          ? new Date(
                              rv.hotelResponse.respondedAt
                            ).toLocaleString()
                          : null}
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    className="flex-1 rounded border px-2 py-1 text-sm"
                    placeholder="Write a response to this review"
                    value={replyText[String(rv._id || rv.id)] || ""}
                    onChange={(e) =>
                      setReplyText((m) => ({
                        ...m,
                        [String(rv._id || rv.id)]: e.target.value,
                      }))
                    }
                  />
                  <Button
                    size="sm"
                    disabled={
                      !replyText[String(rv._id || rv.id)] ||
                      replyMutation.isPending
                    }
                    onClick={() =>
                      replyMutation.mutate({
                        reviewId: String(rv._id || rv.id),
                        text: replyText[String(rv._id || rv.id)],
                      })
                    }
                  >
                    Reply
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
