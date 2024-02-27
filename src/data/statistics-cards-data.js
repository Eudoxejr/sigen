import {
  BanknotesIcon,
  UserPlusIcon,
  UserIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import { PiIdentificationCardBold } from "react-icons/pi";
import { AiFillCar } from "react-icons/ai";
import { MdOutlineModeOfTravel, MdEmojiTransportation } from "react-icons/md";
import { GiTransportationRings } from "react-icons/gi";

export const statisticsCardsData = [
  {
    color: "blue",
    icon: BanknotesIcon,
    title: "CA",
    value: "$53k",
    // footer: null,
  },
  {
    color: "pink",
    icon: UserIcon,
    title: "Utilisateurs",
    value: "15",
    // footer: {
    //   color: "text-green-500",
    //   value: "+3%",
    //   label: "than last month",
    // },
  },
  {
    color: "green",
    icon: PiIdentificationCardBold,
    title: "Conducteurs",
    value: "3",
    // footer: {
    //   color: "text-red-500",
    //   value: "-2%",
    //   label: "than yesterday",
    // },
  },
  {
    color: "orange",
    icon: MdOutlineModeOfTravel,
    title: "Courses",
    value: "103,430",
    // footer: {
    //   color: "text-green-500",
    //   value: "+5%",
    //   label: "than yesterday",
    // },
  },
  {
    color: "cyan",
    icon: GiTransportationRings,
    title: "Mode transport",
    value: "4",
    // footer: {
    //   color: "text-green-500",
    //   value: "+5%",
    //   label: "than yesterday",
    // },
  },
  {
    color: "purple",
    icon: MdEmojiTransportation,
    title: "Moyen transport",
    value: "6",
    // footer: {
    //   color: "text-green-500",
    //   value: "+5%",
    //   label: "than yesterday",
    // },
  },
  {
    color: "brown",
    icon: AiFillCar,
    title: "Véhicules",
    value: "80",
    // footer: {
    //   color: "text-green-500",
    //   value: "+5%",
    //   label: "than yesterday",
    // },
  },
];

export default statisticsCardsData;
