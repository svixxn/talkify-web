import { registerUser } from "@/hooks/react-query/functions";
import { authTokenName } from "@/utils/constants";
import { addTimeToDate } from "@/utils/general";

export async function POST(request: Request) {
  const body = await request.json();

  const res = await registerUser({
    email: body.email,
    age: parseInt(body.age.toString()),
    name: body.name,
    password: body.password,
  });

  if (res.error) return new Response(JSON.stringify({ error: res.error }));

  if (!res.data) return new Response(JSON.stringify({ message: "error" }));

  const { token, expiresIn } = res.data;

  const finalExpiresData = addTimeToDate(expiresIn);

  return new Response(JSON.stringify({ message: "success" }), {
    headers: {
      "Set-Cookie": `${authTokenName}=${token};expires=${finalExpiresData.toUTCString()};path=/`,
    },
  });
}
