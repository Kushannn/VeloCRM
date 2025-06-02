import { NextRequest, NextResponse } from "next/server";
import { createUser } from "../../../../lib/actions/createUser";
import { redirect } from "next/navigation";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { id, email_addresses, first_name, last_name, image_url } = body.data;

  const email = email_addresses?.[0]?.email_address;

  const newUser = {
    clerkId: id,
    email,
    name: `${first_name ?? ""} ${last_name ?? ""}`.trim(),
    image: image_url,
  };

  const result = await createUser(newUser);

  return NextResponse.json(result);
}
// This code handles the creation of a user when a webhook is triggered by Clerk.
// It extracts user information from the request body, constructs a user object,
// and calls the `createUser` function to insert the user into the database.
