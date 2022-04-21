import SingleSwiss from "../components/Swiss";
import { PGNProvider } from "../hooks/usePgn";

export default function Swiss() {
  return (
    <div>
      <PGNProvider>
        <SingleSwiss />
      </PGNProvider>
    </div>
  );
}
