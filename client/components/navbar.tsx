import * as React from "react";
import Nav from "./ui/nav";
import { getSession, getUserDetails } from "@/lib/supabase-server";

export default async function Navbar({ dark }: { dark?: boolean }) {
  const [session, userDetails] = await Promise.all([
    getSession(),
    getUserDetails(),
  ]);
  const user = session?.user;

  return <Nav dark={dark} user={user} userDetails={userDetails} />;
}
