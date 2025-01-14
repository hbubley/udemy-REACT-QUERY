import { useMutation, useQuery } from 'react-query'

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/postId/${postId}`,
    { method: "PATCH", data: { title: "REACT QUERY FOREVER!!!!" } }
  );
  return response.json();
}

export function PostDetail({ post }) {
  const { data, isLoading, isError, error } = useQuery(["comments", post.id], () => fetchComments(post.id), { staleTime: 2000 });
  const deleteMutation = useMutation(() => deletePost(post.id))
  const updateMutation = useMutation(() => updatePost(post.id))

  if (isLoading) return <h3>Loading...</h3>
  if (isError) {
    return (
      <>
        <h3>Oops, something went wrong...</h3>
        <p>{error.toString()}</p>
      </>
    )
  }

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button onClick={() => deleteMutation.mutate()}>
        Delete
      </button>
      {deleteMutation.isError && <p>Error deleting post</p>}
      {deleteMutation.isLoading && <p>Deleting post</p>}
      {deleteMutation.isSuccess && <p>Successfully deleted post</p>}
      <button onClick={() => updateMutation.mutate()}>
        Update title
      </button>
      {updateMutation.isError && <p>Error updating post</p>}
      {updateMutation.isLoading && <p>Updating post</p>}
      {updateMutation.isSuccess && <p>Successfully updated post</p>}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
