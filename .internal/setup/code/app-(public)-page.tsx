import { Suspense } from "react";
import { getSessionOrReject } from "../_actions/auth";

export default async function Page() {
  return (
    <div className="space-y-10 p-10">
      <h1 className="text-2xl text-center">Hello World 😄</h1>
      <Suspense fallback={<p>loading...</p>}>
        <ValidateUser />
      </Suspense>
    </div>
  );
}

async function ValidateUser() {
  const session = await getSessionOrReject();

  return (
    <p className="text-gray-300" aria-label="User status">
      {session?.data?.user
        ? `you are signed in as ${session.data.user.name} 😄`
        : "you are not signed in 🥲"}
    </p>
  );
}
