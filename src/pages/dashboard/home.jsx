import React from "react";
import {
  BanknotesIcon,
  UserIcon
} from "@heroicons/react/24/solid";
import { FaFolder } from "react-icons/fa";
import { HiUsers } from "react-icons/hi2";
import { PiIdentificationCardBold } from "react-icons/pi";
import { AiFillCar } from "react-icons/ai";
import { FaUserShield } from "react-icons/fa6"
import { MdOutlineModeOfTravel, MdEmojiTransportation } from "react-icons/md";
import { GiTransportationRings } from "react-icons/gi";
import { BiCategoryAlt } from "react-icons/bi";
// import TransportModeCard from "@/components/home/transportMode";
// import DriverMiniatureCard from "@/components/home/driverMiniature";
import { StatisticsCard } from "@/widgets/cards";
// import { isAllowedTo } from "@/utils";
// import { Permissions } from "@/data/role-access-data";
// import { RenderIf } from "@/components/common";
import { useQuery } from "@tanstack/react-query";
// import { OtherApi } from "@/api/api";

export function Home() {

  const { isError, data: kpis, error, isLoading } = useQuery({
		queryKey: ['getGlobalKpi'],
		queryFn: async ({ queryKey }) => {
			return OtherApi.getGlobalKpi()
		},
		onSuccess: (data) => {},
		enabled: true,
		staleTime: 40 * 60 * 1000
	})

  // React.useEffect(() => {
  //   console.log('====================================');
  //   console.log(isLoading);
  //   console.log('====================================');
  // }, [isLoading]);

  return (

    // <RenderIf allowedTo={Permissions.VIEW_STATS}>

      <div className="mt-12">

        <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">

          <StatisticsCard
            key={"Dossiers"}
            color={"pink"}
            value={!isLoading ? kpis?.data?.user || "18" : "..."}
            title={"Dossiers"}
            icon={React.createElement(FaFolder, {
              className: "w-6 h-6 text-white",
            })}
          />

          <StatisticsCard
            key={"Clients"}
            color={"green"}
            value={!isLoading ? kpis?.data?.driver || "18" : "..."}
            title={"Clients"}
            icon={React.createElement(HiUsers, {
              className: "w-6 h-6 text-white",
            })}
          />
          
          <StatisticsCard
            key={"Collaborateurs"}
            color={"orange"}
            value={!isLoading ? kpis?.data?.reservation || "18" : "..."}
            title={"Collaborateurs"}
            icon={React.createElement(FaUserShield, {
              className: "w-6 h-6 text-white",
            })}
          />
          
          <StatisticsCard
            key={"Catégories"}
            color={"cyan"}
            value={!isLoading ? kpis?.data?.transportMode || "18" : "..."}
            title={"Catégories"}
            icon={React.createElement(BiCategoryAlt, {
              className: "w-6 h-6 text-white",
            })}
          />
          
          <StatisticsCard
            key={"Templates"}
            color={"brown"}
            value={!isLoading ? kpis?.data?.vehicule || "18" : "..."}
            title={"Templates de minute"}
            icon={React.createElement(AiFillCar, {
              className: "w-6 h-6 text-white",
            })}
          />

        </div>

        <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {/* {isAllowedTo(Permissions.VIEW_MODE_TRANSPORT) &&  */}
            {/* <TransportModeCard /> */}
          {/* } */}
          {/* {isAllowedTo(Permissions.VIEW_DRIVERS_LIST) &&  */}
            {/* <DriverMiniatureCard /> */}
          {/* } */}
        </div>

      </div>

  );
}

export default Home;
