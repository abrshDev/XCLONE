import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType }) => {
  //const isLoading = false;

  const {
    data: posts,
    isFetching,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        let res;
        if (feedType === "forYou") {
          res = await fetch("/api/post/all");
        } else if (feedType === "following") {
          res = await fetch("/api/post/following");
        }
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "something went wrong");
        console.log(data);
        return data;
      } catch (error) {
        throw error;
      }
    },
  });
  useEffect(() => {
    refetch();
  }, [feedType, refetch]);
  return (
    <>
      {(isLoading || isFetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isFetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isFetching && posts && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
    </>
  );
};
export default Posts;
