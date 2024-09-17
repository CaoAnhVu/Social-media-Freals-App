import { redirect } from "next/navigation";

import { fetchCommunityPosts } from "@/lib/actions/community.actions";
import { fetchUserPosts } from "@/lib/actions/user.actions";

import FrealCard from "../cards/FrealCard";

interface Result {
  name: string;
  image: string;
  id: string;
  freals: {
    _id: string;
    text: string;
    parentId: string | null;
    author: {
      name: string;
      image: string;
      id: string;
    };
    community: {
      id: string;
      name: string;
      image: string;
    } | null;
    createdAt: string;
    children: {
      author: {
        image: string;
      };
    }[];
  }[];
}

interface Props {
  currentUserId: string;
  accountId: string;
  accountType: string;
}

async function FrealsTab({ currentUserId, accountId, accountType }: Props) {
  let result: Result;

  if (accountType === "Community") {
    result = await fetchCommunityPosts(accountId);
  } else {
    result = await fetchUserPosts(accountId);
  }

  if (!result) {
    redirect("/");
  }

  return (
    <section className="mt-9 flex flex-col gap-10">
      {result.freals.map((freal) => (
        <FrealCard
          key={freal._id}
          id={freal._id}
          currentUserId={currentUserId}
          parentId={freal.parentId}
          content={freal.text}
          author={
            accountType === "User"
              ? { name: result.name, image: result.image, id: result.id }
              : {
                  name: freal.author.name,
                  image: freal.author.image,
                  id: freal.author.id,
                }
          }
          community={accountType === "Community" ? { name: result.name, id: result.id, image: result.image } : freal.community}
          createdAt={freal.createdAt}
          comments={freal.children}
        />
      ))}
    </section>
  );
}

export default FrealsTab;
