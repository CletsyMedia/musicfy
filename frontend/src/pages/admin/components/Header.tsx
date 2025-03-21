import { UserButton } from "@clerk/clerk-react";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start gap-3">
        <Link to="/" className="mt-1 rounded-lg">
          <img
            src="/musicfy.png"
            alt="Musicfy Logo"
            className="text-black size-8"
          />
        </Link>
        <div>
          <h1 className="text-xl font-bold md:text-3xl">Musicfy Manager</h1>
          <p className="mt-1 text-zinc-400">Manage your musicfy catalog</p>
        </div>
      </div>
      <UserButton />
    </div>
  );
};

export default Header;
