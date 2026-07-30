//This is used to connect to multiple events of a single channel //

"use client";

import { acquireChannel, releaseChannel } from "./pusherChannelRegistry";
import { useEffect } from "react";

export function usePusherEvents(
  channelName: string | undefined | null,
  events: Record<string, (data: any) => void>,
) {
  useEffect(() => {
    if (!channelName) return;
    const channel = acquireChannel(channelName);

    const entries = Object.entries(events);
    entries.forEach(([eventName, handler]) => channel.bind(eventName, handler));

    return () => {
      entries.forEach(([eventName, handler]) =>
        channel.unbind(eventName, handler),
      );
      releaseChannel(channelName);
    };
  }, [channelName, JSON.stringify(Object.keys(events))]);
}
