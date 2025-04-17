-- DropForeignKey
ALTER TABLE "Feed" DROP CONSTRAINT "Feed_channelId_fkey";

-- AddForeignKey
ALTER TABLE "Feed" ADD CONSTRAINT "Feed_channelId_fkey" FOREIGN KEY ("channelId") REFERENCES "Channel"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
