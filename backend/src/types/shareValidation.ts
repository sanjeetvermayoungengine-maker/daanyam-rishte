import { z } from "zod";

const bioPhotoSchema = z.object({
  id: z.string(),
  url: z.string().max(8_000_000),
  name: z.string(),
  uploadedAt: z.string(),
});

export const bioDataSnapshotSchema = z
  .object({
    personalDetails: z
      .object({
        fullName: z.string().max(200),
        dob: z.string().max(20),
      })
      .passthrough(),
    photos: z.object({
      items: z.array(bioPhotoSchema).max(6),
      primaryPhotoId: z.string().nullable(),
    }),
    family: z.object({}).passthrough(),
    horoscope: z.object({}).passthrough(),
    template: z.enum(["traditional", "modern", "premium", "split"]),
  })
  .superRefine((value, ctx) => {
    const serialized = JSON.stringify(value);
    if (serialized.length > 50 * 1024 * 1024) {
      ctx.addIssue({
        code: "custom",
        message: "bioData payload exceeds 50MB",
      });
    }
  });
