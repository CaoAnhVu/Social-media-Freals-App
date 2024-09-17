"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

import { deleteFreal } from "@/lib/actions/freal.actions";

interface Props {
  frealId: string;
  currentUserId: string;
  authorId: string;
  parentId: string | null;
  isComment?: boolean;
}

function DeleteFreal({ frealId, currentUserId, authorId, parentId, isComment }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  if (currentUserId !== authorId || pathname === "/") return null;

  return (
    <Image
      src="/assets/delete.svg"
      alt="delte"
      width={18}
      height={18}
      className="cursor-pointer object-contain"
      onClick={async () => {
        await deleteFreal(JSON.parse(frealId), pathname);
        if (!parentId || !isComment) {
          router.push("/");
        }
      }}
    />
  );
}

export default DeleteFreal;
