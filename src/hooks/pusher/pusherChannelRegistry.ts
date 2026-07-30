// Used for reference counting so that a channel is not destroyed by leaving of a single user or a single page ,
// this is centralized because if a page calls usePusherChannel and another calls usePusherChannels on the same channel , then each hook will think they are the only using that channel so they both have different maps of their own which causes errors , hence we have to centralize the mapping issue //

import { pusherClient } from "@/lib/pusherClient";

const channelRefCounts = new Map<string, number>();

export function acquireChannel(channelName: string) {
  const channel = pusherClient.subscribe(channelName);
  channelRefCounts.set(
    channelName,
    (channelRefCounts.get(channelName) ?? 0) + 1,
  );
  return channel;
}

export function releaseChannel(channelName: string) {
  const count = (channelRefCounts.get(channelName) ?? 1) - 1;
  if (count <= 0) {
    channelRefCounts.delete(channelName);
    pusherClient.unsubscribe(channelName);
  } else {
    channelRefCounts.set(channelName, count);
  }
}
