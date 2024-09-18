import { Webhook, WebhookRequiredHeaders } from "svix";
import { headers } from "next/headers";
import { IncomingHttpHeaders } from "http";
import { NextResponse } from "next/server";
import { addMemberToCommunity, createCommunity, deleteCommunity, removeUserFromCommunity, updateCommunityInfo } from "@/lib/actions/community.actions";

type EventType = "organization.created" | "organizationInvitation.created" | "organizationMembership.created" | "organizationMembership.deleted" | "organization.updated" | "organization.deleted";

type Event = {
  data: Record<string, any>; // Chỉnh kiểu phù hợp
  object: "event";
  type: EventType;
};

export const POST = async (request: Request) => {
  const payload = await request.json();
  const header = headers();

  const heads = {
    "svix-id": header.get("svix-id"),
    "svix-timestamp": header.get("svix-timestamp"),
    "svix-signature": header.get("svix-signature"),
  };

  const wh = new Webhook(process.env.NEXT_CLERK_WEBHOOK_SECRET || "");

  let evnt: Event | null = null;

  try {
    evnt = wh.verify(JSON.stringify(payload), heads as IncomingHttpHeaders & WebhookRequiredHeaders) as Event;
  } catch (err) {
    return NextResponse.json({ message: "Invalid webhook signature" }, { status: 400 });
  }

  const eventType: EventType = evnt?.type!;

  switch (eventType) {
    case "organization.created":
      const { id, name, slug, logo_url, image_url, created_by } = evnt?.data ?? {};
      try {
        await createCommunity(id, name, slug, logo_url || image_url, "org bio", created_by);
        return NextResponse.json({ message: "Community created" }, { status: 201 });
      } catch (err) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
      }

    // Các sự kiện khác tương tự...

    case "organization.deleted":
      try {
        const { id } = evnt?.data;
        await deleteCommunity(id);
        return NextResponse.json({ message: "Organization deleted" }, { status: 201 });
      } catch (err) {
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
      }

    default:
      return NextResponse.json({ message: "Event not handled" }, { status: 400 });
  }
};
