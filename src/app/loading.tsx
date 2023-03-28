import { MoonLoader } from "react-spinners";
import { override } from "./components/Buy";

export default function loading() {
  return <MoonLoader cssOverride={override} size={30} color="gray" />;
}
