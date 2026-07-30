// This is used to connect to multiple channels//

"use client";

import { useEffect } from "react";
import { acquireChannel, releaseChannel } from "./pusherChannelRegistry";

export function usePusherChannels<T = any>(
  channelNames: string[],
  eventName: string,
  onEvent: (data: T) => void,
) {
  useEffect(() => {
    if (!channelNames.length) return;

    const channels = channelNames.map((name) => acquireChannel(name));
    channels.forEach((channel) => channel.bind(eventName, onEvent));

    return () => {
      channels.forEach((channel) => {
        channel.unbind(eventName, onEvent);
        releaseChannel(channel.name);
      });
    };
  }, [channelNames.join(","), eventName]);
}
