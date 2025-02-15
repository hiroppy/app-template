import { Form } from "./_components/Form";

// bug: https://github.com/vercel/next.js/issues/74128
// users who are not logged in cannot reach here due to intercepting routes.
export default function Page() {
  return <Form />;
}
