import type { Route } from "next";
import { unstable_cacheTag as cacheTag } from "next/cache";
import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getSessionOrReject } from "../_actions/auth";
import { deleteAll } from "../_actions/items";
import { prisma } from "../_clients/prisma";
import { Button } from "../_components/Button";
import { format } from "../_utils/date";

export default async function Page() {
  return (
    <div className="space-y-5">
      <Suspense fallback={<p>loading...</p>}>
        <Status />
      </Suspense>
      <Suspense fallback={<p>loading...</p>}>
        <ItemList />
      </Suspense>
    </div>
  );
}

async function Status() {
  const session = await getSessionOrReject();

  return (
    <div className="flex justify-between gap-3 flex-col md:flex-row md:items-center">
      <p className="text-gray-300" aria-label="User status">
        {session?.data?.user
          ? `you are signed in as ${session.data.user.name} 😄`
          : "you are not signed in 🥲"}
      </p>
      {session?.data?.user && (
        <div className="flex items-center gap-4">
          <Link href={"/create" as Route} scroll={false}>
            <Button className="bg-blue-600">Add an item</Button>
          </Link>
          <form action={deleteAll}>
            <Button type="submit" className="bg-orange-800  text-gray-100">
              Delete my items
            </Button>
          </form>
        </div>
      )}
    </div>
  );
}

async function ItemList() {
  "use cache";

  cacheTag("items");

  const data = await prisma.item.findMany({
    include: {
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <ul className="space-y-4" aria-label="items">
      {data.map(({ id, content, createdAt, user }) => (
        <li
          key={id}
          className="border border-gray-600 p-4 flex justify-between items-start rounded-md"
        >
          <div className="flex justify-center gap-4 items-center">
            {user.image && (
              <Image
                alt={user.name ?? "no name"}
                src={user.image}
                width={56}
                height={56}
                className="rounded-full border-2 border-gray-300"
                priority
              />
            )}
            <h2
              className="font-semibold md:text-xl break-all"
              title="memo title"
            >
              {content}
            </h2>
          </div>
          <span className="text-sm text-gray-300">{format(createdAt)}</span>
        </li>
      ))}
    </ul>
  );
}
