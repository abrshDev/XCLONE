import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

// Create a function to handle different fetch logic based on feedType
const fetchPosts = async (feedType, userid, username) => {
  let res;
  switch (feedType) {
    case "forYou":
      res = await fetch("/api/post/all");
      break;
    case "following":
      res = await fetch("/api/post/following");
      break;
    case "likes":
      res = await fetch(`/api/post/like/${userid}`);
      break;
    case "posts":
      res = await fetch(`/api/post/user/${username}`);

      break;
    default:
      throw new Error("Invalid feed type");
  }

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "something went wrong");

  return data;
};

const Posts = ({ feedType, userid, username }) => {
  const {
    data: posts = [], // Default to empty array if no data
    isFetching,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["posts"], // Include feedType in queryKey to refetch based on type
    queryFn: () => fetchPosts(feedType, userid, username),
  });

  useEffect(() => {
    refetch(); // Refetch when feedType changes
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
      {!isLoading && !isFetching && posts.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isFetching && posts.length > 0 && (
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
