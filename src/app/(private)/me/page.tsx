import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getSessionOrReject } from "../../_actions/auth";
import { UpdateMyInfo } from "./_components/UpdateMyInfo";

export default async function Page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <ValidateUser />
    </Suspense>
  );
}

async function ValidateUser() {
  const session = await getSessionOrReject();

  if (!session.success) {
    notFound();
  }

  const { user } = session.data;

  return <UpdateMyInfo name={user.name ?? ""} />;
}
