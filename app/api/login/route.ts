import { loginUser } from "@/hooks/react-query/functions";
import { addTimeToDate } from "@/utils/general";
import { SignInSchema } from "@/utils/validation";

export async function POST(request: Request) {
  const body = await request.json();

  console.log("body", body);

  const parseRes = SignInSchema.safeParse(body);

  if (!parseRes.success) {
    return Response.json({ message: parseRes.error.errors });
  }

  const res = await loginUser(parseRes.data);

  if (res.error) return new Response(JSON.stringify({ error: res.error }));

  const { token, expiresIn } = res.data;

  const finalExpiresData = addTimeToDate(expiresIn);

  return new Response(JSON.stringify({ message: "success" }), {
    headers: {
      "Set-Cookie": `authtoken=${token};expires=${finalExpiresData.toUTCString()};path=/`,
    },
  });
}
