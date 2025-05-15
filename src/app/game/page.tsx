import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function GameRedirectPage() {
  const user = await currentUser();

  if (!user?.id) {
    return redirect("/sign-in"); // o la ruta de inicio
  }
  const executeCode = async (sql: string) => {
    try {
      const res = await fetch("/api/db", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: sql }),
      })
      const json = await res.json()
      return json.rows || []
    } catch (err) {
      console.error("DB error:", err)
      return []
    }
  }

  const result = await executeCode(`
    SELECT progress FROM user_score WHERE user_id = '${user.id}';
  `);

  const progress = result?.[0]?.progress || 1;

  redirect(`/game/${progress}`);
}
