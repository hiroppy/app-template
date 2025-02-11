import { Suspense } from "react";
import { Payment } from "../../../_components/Payment";

export default async function Page() {
  return (
    <Suspense fallback={<p>loading...</p>}>
      <Payment />
    </Suspense>
  );
}
