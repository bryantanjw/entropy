import * as React from "react";
import { User } from "@supabase/supabase-js";

import Nav from "./ui/nav";
import { getSession, getUserDetails } from "@/lib/supabase-server";

export default async function Navbar() {
  const [session, userDetails] = await Promise.all([
    getSession(),
    getUserDetails(),
  ]);
  const user = session?.user;

  return <Nav user={user} userDetails={userDetails} />;
}
