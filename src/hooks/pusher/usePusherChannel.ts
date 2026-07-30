//This is used to connect to a single channel //

"use client";

import { useEffect } from "react";
import { acquireChannel, releaseChannel } from "./pusherChannelRegistry";

export function usePusherChannel<T = any>(
  channelName: string | undefined | null,
  eventName: string,
  onEvent: (data: T) => void,
) {
  useEffect(() => {
    if (!channelName) return;

    const channel = acquireChannel(channelName);

    channel.bind("pusher:subscription_error", (err: any) => {
      console.error(`Subscription failed for ${channelName}:`, err);
    });
    channel.bind(eventName, onEvent);

    return () => {
      channel.unbind(eventName, onEvent);
      releaseChannel(channelName);
    };
  }, [channelName, eventName]);
}
