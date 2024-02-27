import React from "react";
import {
  BanknotesIcon,
  UserIcon
} from "@heroicons/react/24/solid";
import { PiIdentificationCardBold } from "react-icons/pi";
import { AiFillCar } from "react-icons/ai";
import { MdOutlineModeOfTravel, MdEmojiTransportation } from "react-icons/md";
import { GiTransportationRings } from "react-icons/gi";
import TransportModeCard from "@/components/home/transportMode";
import DriverMiniatureCard from "@/components/home/driverMiniature";
import { StatisticsCard } from "@/widgets/cards";
import { isAllowedTo } from "@/utils";
import { Permissions } from "@/data/role-access-data";
import { RenderIf } from "@/components/common";
import { useQuery } from "@tanstack/react-query";
import { OtherApi } from "@/api/api";

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

    <RenderIf allowedTo={Permissions.VIEW_STATS}>

      <div className="mt-12">

        <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">

          <StatisticsCard
            key={"Utilisateurs"}
            color={"pink"}
            value={!isLoading ? kpis?.data?.user || "" : "..."}
            title={"Utilisateurs"}
            icon={React.createElement(UserIcon, {
              className: "w-6 h-6 text-white",
            })}
          />

          <StatisticsCard
            key={"Conducteurs"}
            color={"green"}
            value={!isLoading ? kpis?.data?.driver || "" : "..."}
            title={"Conducteurs"}
            icon={React.createElement(UserIcon, {
              className: "w-6 h-6 text-white",
            })}
          />
          
          <StatisticsCard
            key={"Courses"}
            color={"orange"}
            value={!isLoading ? kpis?.data?.reservation || "" : "..."}
            title={"Courses"}
            icon={React.createElement(MdOutlineModeOfTravel, {
              className: "w-6 h-6 text-white",
            })}
          />
          
          <StatisticsCard
            key={"Mode transport"}
            color={"cyan"}
            value={!isLoading ? kpis?.data?.transportMode || "" : "..."}
            title={"Mode transport"}
            icon={React.createElement(GiTransportationRings, {
              className: "w-6 h-6 text-white",
            })}
          />

          <StatisticsCard
            key={"Moyen transport"}
            color={"purple"}
            value={!isLoading ? kpis?.data?.transportMoyen || "" : "..."}
            title={"Moyen transport"}
            icon={React.createElement(MdEmojiTransportation, {
              className: "w-6 h-6 text-white",
            })}
          />
          
          <StatisticsCard
            key={"Véhicules"}
            color={"brown"}
            value={!isLoading ? kpis?.data?.vehicule || "" : "..."}
            title={"Véhicules"}
            icon={React.createElement(AiFillCar, {
              className: "w-6 h-6 text-white",
            })}
          />

        </div>

        {/* <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
          {statisticsChartsData.map((props) => (
            <StatisticsChart
              key={props.title}
              {...props}
              footer={
                <Typography
                  variant="small"
                  className="flex items-center font-normal text-blue-gray-600"
                >
                  <ClockIcon strokeWidth={2} className="h-4 w-4 text-inherit" />
                  &nbsp;{props.footer}
                </Typography>
              }
            />
          ))}
        </div> */}

        <div className="mb-4 grid grid-cols-1 gap-6 xl:grid-cols-3">
          {isAllowedTo(Permissions.VIEW_MODE_TRANSPORT) && <TransportModeCard />}
          {isAllowedTo(Permissions.VIEW_DRIVERS_LIST) && <DriverMiniatureCard />}
        </div>

      </div>
    </RenderIf>
  );
}

export default Home;
