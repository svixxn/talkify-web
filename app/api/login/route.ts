import { loginUser } from "@/hooks/react-query/functions";
import { authTokenName } from "@/utils/constants";
import { addTimeToDate } from "@/utils/general";
import { SignInSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const body = await request.json();

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
      "Set-Cookie": `${authTokenName}=${token};expires=${finalExpiresData.toUTCString()};path=/`,
    },
  });
}

export async function DELETE(request: Request) {
  return new Response(null, {
    headers: {
      "Set-Cookie": `${authTokenName}=deleted;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`,
    },
  });
}
