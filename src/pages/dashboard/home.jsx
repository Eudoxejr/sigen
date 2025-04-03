import React from "react";
import { FaFolder } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import { FaUserShield } from "react-icons/fa6"
import { IoReload } from "react-icons/io5";
import { GiBookPile } from "react-icons/gi";
import { BiCategoryAlt } from "react-icons/bi";
import FolderCard from "@/components/home/folderMinuature";
import { StatisticsCard } from "@/widgets/cards";
import { useQuery } from "@tanstack/react-query";
import { OtherApi } from "@/api/api";
import ClientMiniatureCard from "@/components/home/clientMiniature";
import { useUserStore } from "@/store/user.store"

export function Home() {

  const {user} = useUserStore()

  const { data: kpis, refetch, isFetching } = useQuery({
		queryKey: ['getGlobalKpi'],
		queryFn: async ({ queryKey }) => {
			return OtherApi.getGlobalKpi()
		},
		enabled: true,
		staleTime: 15 * 60 * 1000
	})


  return (

    // <RenderIf allowedTo={Permissions.VIEW_STATS}>

      <div className="mt-3">

        <div className=" font-medium text-gray-800 text-[20px] mt-8 mb-2 " >
          Bienvenue <span>{user.user.firstname+" "+user.user.lastname}</span> 
        </div>

        <div className=" w-full mb-3 flex justify-end " >
          <button onClick={() => refetch()} className=" bg-primary flex items-center justify-center rounded-md w-[50px] h-[45px] " >
            {isFetching ?
              "..."
            :
              <IoReload color="white" />
            }
          </button>
        </div>

        <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">

          <StatisticsCard
            key={"Dossiers"}
            color={"pink"}
            value={!isFetching ? kpis?.folderCount || "0" : "..."}
            title={"Dossiers"}
            icon={React.createElement(FaFolder, {
              className: "w-6 h-6 text-white",
            })}
          />

          <StatisticsCard
            key={"Clients"}
            color={"green"}
            value={!isFetching ? kpis?.clientCount || "0" : "..."}
            title={"Clients"}
            icon={React.createElement(HiUsers, {
              className: "w-6 h-6 text-white",
            })}
          />
          
          <StatisticsCard
            key={"Collaborateurs"}
            color={"orange"}
            value={!isFetching ? kpis?.userCount || "0" : "..."}
            title={"Collaborateurs"}
            icon={React.createElement(FaUserShield, {
              className: "w-6 h-6 text-white",
            })}
          />
          
          <StatisticsCard
            key={"Catégories"}
            color={"cyan"}
            value={!isFetching ? kpis?.categoryCount || "0" : "..."}
            title={"Catégories"}
            icon={React.createElement(BiCategoryAlt, {
              className: "w-6 h-6 text-white",
            })}
          />
          
          <StatisticsCard
            key={"Templates"}
            color={"brown"}
            value={!isFetching ? kpis?.templateCount || "0" : "..."}
            title={"Templates de minute"}
            icon={React.createElement(GiBookPile, {
              className: "w-7 h-7 text-white",
            })}
          />

        </div>

        <div className="mb-4 flex flex-row flex-wrap gap-8">
          {/* {isAllowedTo(Permissions.VIEW_MODE_TRANSPORT) &&  */}
            <FolderCard />
          {/* } */}
          {/* {isAllowedTo(Permissions.VIEW_DRIVERS_LIST) &&  */}
            <ClientMiniatureCard />
          {/* } */}
        </div>

      </div>

  );
}

export default Home;
