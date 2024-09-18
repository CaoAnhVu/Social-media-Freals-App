import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import Comment from "@/components/forms/Comment";
import FrealCard from "@/components/cards/FrealCard";

import { fetchUser } from "@/lib/actions/user.actions";
import { fetchFrealById } from "@/lib/actions/freal.actions";

export const revalidate = 0;

async function page({ params }: { params: { id: string } }) {
  if (!params.id) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const freal = await fetchFrealById(params.id);

  return (
    <section className="relative">
      <div>
        <FrealCard
          id={freal._id}
          currentUserId={user.id}
          parentId={freal.parentId}
          content={freal.text}
          author={freal.author}
          community={freal.community}
          createdAt={freal.createdAt}
          comments={freal.children}
        />
      </div>

      <div className="mt-7">
        <Comment frealId={params.id} currentUserImg={user.imageUrl} currentUserId={JSON.stringify(userInfo._id)} />
      </div>

      <div className="mt-10">
        {freal.children.map((childItem: any) => (
          <FrealCard
            key={childItem._id}
            id={childItem._id}
            currentUserId={user.id}
            parentId={childItem.parentId}
            content={childItem.text}
            author={childItem.author}
            community={childItem.community}
            createdAt={childItem.createdAt}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </section>
  );
}

export default page;
