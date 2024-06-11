import {
  Sidenav,
  DashboardNavbar,
} from "@/widgets/layout";
import { useMaterialTailwindController } from "@/context";
import { Outlet } from "react-router-dom";
import {HomeIcon} from "@heroicons/react/24/solid";
import { FaFolder } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import { FaUserShield } from "react-icons/fa6";
import { GiBookPile } from "react-icons/gi";
import { BiCategoryAlt } from "react-icons/bi";
import { SiAuth0 } from "react-icons/si";
import { MdCategory } from "react-icons/md";


const icon = {
  className: "w-5 h-5 text-inherit",
};

export function Dashboard() {

  const [controller, dispatch] = useMaterialTailwindController();

  const { sidenavType } = controller;

  return (
    <div className=" w-full-screen ">
      <Sidenav
        routes={[
          {
            layout: "dashboard",
            pages: [
              {
                icon: <HomeIcon {...icon} />,
                name: "Accueil",
                path: "/accueil"
              },
              {
                icon: <FaFolder {...icon} />,
                name: "Dossiers",
                path: "/dossiers"
              },
              {
                icon: <HiUsers {...icon} />,
                name: "Clients",
                path: "/clients"
              },
              {
                icon: <FaUserShield {...icon} />,
                name: "Collaborateurs",
                path: "/collaborateurs"
              },
              {
                icon: <GiBookPile {...icon} />,
                name: "Templates Minutes",
                path: "/minutes"
              },
              {
                icon: <MdCategory {...icon} />,
                name: "Groupe catégorie",
                path: "/groupes-categories"
              },
              {
                icon: <BiCategoryAlt {...icon} />,
                name: "Categories",
                path: "/categories"
              },
              {
                icon: <SiAuth0 {...icon} />,
                name: "Roles & permissions",
                path: "/roles"
              },
            ],
          },
        ]}
      />
      <div className="p-3 xl:ml-80 ">
        <DashboardNavbar />
        <div>
          <Outlet />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
