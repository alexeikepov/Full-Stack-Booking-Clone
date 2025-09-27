import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { TabProps } from "./types";

export default function MediaTab({ formData, setFormData }: TabProps) {
  const [newMediaUrl, setNewMediaUrl] = useState("");

  const addMediaUrl = () => {
    const url = newMediaUrl.trim();
    if (!url) return;
    setFormData((prev: any) => ({
      ...prev,
      media: [...(prev.media || []), url],
    }));
    setNewMediaUrl("");
  };

  const removeMediaUrl = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      media: (prev.media || []).filter((_: string, i: number) => i !== index),
    }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="newMedia">Add image URL</Label>
        <div className="flex gap-2">
          <Input
            id="newMedia"
            placeholder="https://..."
            value={newMediaUrl}
            onChange={(e) => setNewMediaUrl(e.target.value)}
          />
          <Button type="button" onClick={addMediaUrl}>
            Add
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(formData.media || []).map(
          (m: string | { url?: string }, i: number) => {
            const url = typeof m === "string" ? m : m?.url || "";
            return (
              <div
                key={`${url}-${i}`}
                className="border rounded p-2 flex flex-col gap-2"
              >
                <div className="aspect-[4/3] bg-gray-100 overflow-hidden rounded">
                  {url ? (
                    <img
                      src={url}
                      alt="media"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full" />
                  )}
                </div>
                <Input
                  value={url}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData((prev: any) => {
                      const next = [...(prev.media || [])];
                      next[i] = v;
                      return { ...prev, media: next };
                    });
                  }}
                />
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => removeMediaUrl(i)}
                >
                  Remove
                </Button>
              </div>
            );
          }
        )}
        {(!formData.media || formData.media.length === 0) && (
          <div className="text-sm text-gray-600">
            No images yet. Add image URLs above.
          </div>
        )}
      </div>
    </div>
  );
}
