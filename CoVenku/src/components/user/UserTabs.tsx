"use client";

import type { Tab } from "./UserClient";

// UserTabs is no longer needed — navigation is built directly into UserClient.
// This file is kept for backward compatibility. It re-exports nothing.
export default function UserTabs(_props: { activeTab: Tab; onChange: (t: Tab) => void }) {
  return null;
}
