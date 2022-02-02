import {
  HomeIcon,
  MenuIcon,
  ShoppingBagIcon,
  NewspaperIcon,
  DocumentTextIcon,
  UserGroupIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useState } from "react";

function Navbar() {
  const [drawer, setDrawer] = useState(false);
  const toggleDrawer = () => {
    if (drawer) setDrawer(false);
    else setDrawer(true);
  };

  return (
    <div className="w-full navbar px-8 flex justify-between items-center sticky top-0 z-50 bg-base-200">
      <h1 className="text-lg font-bold">TieCMS</h1>

      <div className="flex justify-end px-2">
        <div className="flex-none hidden px-2 mx-2 lg:flex">
          <div className="flex">
            <a className="btn btn-ghost rounded-btn" href="/">
              <HomeIcon className="h-6 w-6 pr-1" />
              Home
            </a>
            <a className="btn btn-ghost rounded-btn" href="/">
              <ShoppingBagIcon className="h-6 w-6 pr-1" />
              Shop
            </a>
            <a className="btn btn-ghost rounded-btn" href="/">
              <UserGroupIcon className="h-6 w-6 pr-1" />
              Forum
            </a>
            <a className="btn btn-ghost rounded-btn" href="/">
              <DocumentTextIcon className="h-6 w-6 pr-1" />
              Blog
            </a>
            <a className="btn btn-ghost rounded-btn" href="/">
              <NewspaperIcon className="h-6 w-6 pr-1" />
              News
            </a>
          </div>
        </div>
        <div class="avatar pr-2">
          <div class="rounded-full w-10 h-10 m-1">
            <img src="https://i.pravatar.cc/500?img=32" />
          </div>
        </div>
        <div className="lg:hidden">
          <button className="btn btn-ghost" onClick={() => toggleDrawer()}>
            {drawer ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
        <ul
          className={`p-2 shadow menu bg-base-100 w-52 gap-1 absolute left-0 top-0 h-screen lg:hidden ${
            drawer ? "block" : "hidden"
          }`}
        >
          <li>
            <a className=" btn btn-ghost justify-start">
              <HomeIcon className="h-6 w-6 pr-1" /> Home
            </a>
          </li>
          <li>
            <div className="btn btn-ghost justify-start">
              <ShoppingBagIcon className="h-6 w-6 pr-1" />
              Shop
            </div>
          </li>
          <li>
            <div className=" btn btn-ghost justify-start">
              <UserGroupIcon className="h-6 w-6 pr-1" />
              Forum
            </div>
          </li>
          <li>
            <div className=" btn btn-ghost justify-start">
              <DocumentTextIcon className="h-6 w-6 pr-1" />
              Blog
            </div>
          </li>
          <li>
            <div className="btn btn-ghost justify-start">
              <NewspaperIcon className="h-6 w-6 pr-1" />
              News
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Navbar;
