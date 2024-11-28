-- AlterTable
ALTER TABLE "Video" ALTER COLUMN "currentTimestamp" DROP NOT NULL,
ALTER COLUMN "fileUrl" DROP NOT NULL,
ALTER COLUMN "category" DROP NOT NULL,
ALTER COLUMN "thumbnailUrl" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'PENDING',
ALTER COLUMN "videoUrls" DROP NOT NULL,
ALTER COLUMN "viewCount" SET DEFAULT 0;
