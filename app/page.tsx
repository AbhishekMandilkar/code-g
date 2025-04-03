// import Main from "@/components/Main";
import { redirect } from "next/navigation";

export default function Home() {
  // TODO make this dynamic 
  redirect("/dashboard");
  return <></>;
}
