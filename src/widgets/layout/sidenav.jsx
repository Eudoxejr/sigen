import PropTypes from "prop-types";
import { Link, NavLink } from "react-router-dom";
import { XMarkIcon } from "@heroicons/react/24/outline";
import {
  Avatar,
  Button,
  IconButton,
  Typography,
} from "@material-tailwind/react";
import { useMaterialTailwindController, setOpenSidenav } from "@/context";
import { FiLogOut } from "react-icons/fi";
import { useUserStore } from "@/store/user.store"

export function Sidenav({ brandImg, brandName, routes }) {

  const [controller, dispatch] = useMaterialTailwindController();
  const {setUser} = useUserStore();

  const { sidenavColor, sidenavType, openSidenav } = controller;
  const sidenavTypes = {
    dark: "bg-gradient-to-br from-[#fff] to-[#fff]",
    white: "bg-white shadow-lg",
    transparent: "bg-transparent",
  };

  return (

    <aside
      className={`${sidenavTypes.dark} ${openSidenav ? "translate-x-0" : "-translate-x-80"
        } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] no-scrollbar overflow-y-scroll w-72 rounded-xl transition-transform duration-300 xl:translate-x-0`}
    >
      <div
        className="relative border-b-[0.75px] bg-gradient-to-br from-primary to-primary border-blue-gray-400 "
      >

        <Link to="/" className="flex from-blue-gray-400 items-center justify-center gap-4 py-12 px-8">
          <span className=" font-bold text-white text-[25px] " >
            SIGEN
          </span>
        </Link>

        <IconButton
          variant="text"
          color="white"
          size="sm"
          ripple={false}
          className="absolute right-0 top-0 grid rounded-br-none rounded-tl-none xl:hidden"
          onClick={() => setOpenSidenav(dispatch, false)}
        >
          <XMarkIcon strokeWidth={2.5} className="h-5 w-5 text-white" />
        </IconButton>

      </div>

      <div className="p-4 flex-col flex flex-1">

        {routes.map(({ layout, title, pages }, key) => (

          <ul key={key} className="mb-4 flex flex-col gap-1">

            {title && (
              <li className="mx-3.5 mt-4 mb-2">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-black uppercase opacity-75"
                >
                  {title}
                </Typography>
              </li>
            )}

            {pages.map(({ icon, name, path }) => (

              <li key={name}>

                <NavLink to={`/${layout}${path}`}>
                  {({ isActive }) => (
                    <Button
                      variant={isActive ? "gradient" : "text"}
                      color={
                        isActive
                          ? "blue"
                          :  "blue-gray"
                      }
                      className="flex items-center gap-4 px-4 capitalize"
                      fullWidth
                    >
                      {icon}
                      <Typography
                        color="inherit"
                        className="font-medium text-[13px] capitalize"
                      >
                        {name}
                      </Typography>
                    </Button>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        ))}

        <ul className="mb-4 flex flex-col gap-1">
          <li className="mt-6" >
            {/* <NavLink to={`/${layout}${path}`}> */}
              {/* {({ isActive }) => ( */}
                <Button
                  variant={"gradient" }
                  color={"blue-gray"}
                  className="flex items-center gap-4 px-4 capitalize"
                  fullWidth
                  onClick={() => setUser(false) }
                >
                  <FiLogOut size={20} className="rotate-180" />
                  <Typography
                    color="inherit"
                    className="font-medium text-[13px] capitalize"
                  >
                    Déconnexion
                  </Typography>
                </Button>
            {/* </NavLink> */}
          </li>
        </ul>

      </div>
    </aside>
  );
}

Sidenav.defaultProps = {
  brandImg: "/img/logo-ct.png",
  brandName: "Material Tailwind React",
};

Sidenav.propTypes = {
  brandImg: PropTypes.string,
  brandName: PropTypes.string,
  routes: PropTypes.arrayOf(PropTypes.object).isRequired,
};

Sidenav.displayName = "/src/widgets/layout/sidnave.jsx";

export default Sidenav;
