import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { getSessionOrReject } from "../_actions/auth";
import { Container } from "./Container";
import { AvatarPlaceholder } from "./Placeholder";
import { SignInButton } from "./SignInButton";
import { SignOutButton } from "./SignOutButton";

export async function Header() {
  return (
    <header className="border-b border-b-gray-600 sticky top-0 bg-gray-700 z-30">
      <Container className="flex items-center justify-between" size="md">
        <Suspense fallback={<AvatarPlaceholder />}>
          <Avatar />
        </Suspense>
        <Suspense>
          <Action />
        </Suspense>
      </Container>
    </header>
  );
}

async function Avatar() {
  const session = await getSessionOrReject();

  if (!session?.data?.user.image) {
    return <AvatarPlaceholder />;
  }

  return (
    <Link href="/me">
      <Image
        src={session.data.user.image}
        width={40}
        height={40}
        className="rounded-full"
        alt="profile"
        priority
      />
    </Link>
  );
}

async function Action() {
  const session = await getSessionOrReject();

  if (!session) {
    return <SignInButton />;
  }

  return <SignOutButton />;
}
