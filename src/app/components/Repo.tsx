export async function Repo() {
  const response = await fetch(
    "https://api.github.com/users/Thiago-Mota-Santos"
  );
  const user = await response.json();

  return (
    <div>
      <h1>Home</h1>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  );
}
