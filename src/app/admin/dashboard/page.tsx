import { auth } from "../../../../auth"
 
export default async function Page() {
  const session = await auth()
 
  if (session?.user.role === "ADMIN") {
    return <div>Authenticated as admin</div>
  } else {
    return <div>Not authenticated</div>
  }
 
  
}