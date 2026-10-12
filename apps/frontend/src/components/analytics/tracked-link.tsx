"use client";

import Link from "next/link";
import type { ComponentProps, MouseEvent } from "react";
import { trackEvent } from "@/lib/analytics";

type EventParams = Record<string, string | number | boolean | undefined>;

interface TrackedLinkProps extends ComponentProps<typeof Link> {
  eventName: string;
  eventParams?: EventParams;
}

// A next/link that also fires a tracked event on click — lets a server
// component tree get click tracking on individual links (project cards,
// journal cards) without the whole page becoming a client component.
export function TrackedLink({
  eventName,
  eventParams,
  onClick,
  ...linkProps
}: TrackedLinkProps) {
  function handleClick(e: MouseEvent<HTMLAnchorElement>) {
    trackEvent(eventName, eventParams);
    onClick?.(e);
  }

  return <Link {...linkProps} onClick={handleClick} />;
}
