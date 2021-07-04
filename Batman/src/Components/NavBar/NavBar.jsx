import React from "react";
import { Link, useRouteMatch } from "react-router-dom";
import Avatar from "./Avatar";

const MsgsIcon = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z"
          clipRule="evenodd"
        />
      </svg>
    </div>
  );
};

const UsersIcon = () => {
  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
      </svg>
    </div>
  );
};

const SkypeIcon = () => {
  return <svg>Skype</svg>;
};

const Navbar = ({ username, pp_url }) => {
  let { path, url } = useRouteMatch();
  // rajouter une couleur avec un gradiant sur le hover:
  const cn = "flex flex-row space-x-4"; //"text-white bg-black hover:bg-purple-900 p-5 rounded-md";
  // const selectedCN = " à faire";
  const brandImgUrl =
    "https://cdn.discordapp.com/attachments/776612332507496460/776621846321430628/1465739692-saumon20.png";

  return (
    // "relative flex bg-gradient-to-r from-gray-900 to-red-600 rounded py-2 px-5 mt-1 w-full h-full items-center"
    <nav className="h-16 flex-none w-full bg-gradient-to-r from-gray-900 to-red-600 rounded items-center flex flex-row">
      <img src={brandImgUrl} className="w-auto h-8 w-auto" />
      <div className="pl-4 flex flex-row space-x-8">
        <Link to={url + "/"} className={cn}>
          <MsgsIcon />{" "}
          <div className="invisible absolute md:visible md:relative">
            Messages
          </div>
        </Link>
        {/* <Link to={url + "/skype"} className={cn}>
          <SkypeIcon />
        </Link> */}
        <Link to={url + "/users"} className={cn}>
          <UsersIcon />{" "}
          <div className="invisible absolute md:visible md:relative">Users</div>
        </Link>
        {/* <Link to={url + "/discordAccountGenerator"} className={cn}>
          Discord Acc Gen
        </Link> */}
      </div>

      <div className="absolute right-0 flex space-x-5 mr-5">
        <Avatar username={username} pp_url={pp_url} />
      </div>
    </nav>
  );
};

export default Navbar;
