import { NextResponse } from "next/server";
import webpush from "web-push";

const vapidKeys = {
  publicKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  privateKey: process.env.VAPID_PRIVATE_KEY!,
};

webpush.setVapidDetails(
  process.env.VAPID_MAILTO!,
  vapidKeys.publicKey,
  vapidKeys.privateKey
);

export async function POST(request: Request) {
  try {
    const subscription = await request.json();

    // In a real production app, we would store this in Supabase
    // for the currently authenticated user.
    // Example: 
    // const { data, error } = await supabase.from('user_subscriptions').upsert({ 
    //   user_id: user.id, 
    //   subscription 
    // });

    console.log("Push Subscription Received:", subscription);

    // Send a welcome notification
    await webpush.sendNotification(
      subscription,
      JSON.stringify({
        title: "Prio Notifications Active!",
        body: "You will now receive updates on your tasks and deadlines.",
        icon: "/icons/icon-192x192.png",
        badge: "/icons/icon-192x192.png",
      })
    );

    return NextResponse.json({ message: "Subscription successful" });
  } catch (error) {
    console.error("Error subscribing to push notifications:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
