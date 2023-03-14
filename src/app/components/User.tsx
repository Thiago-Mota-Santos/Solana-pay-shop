export async function User() {
  await new Promise((resolve) => setTimeout(resolve, 2000));

  const response = await fetch(
    "https://api.github.com/users/Thiago-Mota-Santos/repos",
    { cache: "no-store" }
  );
  const user = await response.json();

  return (
    <div>
      <h1>Home</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
