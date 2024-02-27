import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
} from "@material-tailwind/react";
import { Faqs, InfosGenerales, MentionsLegales, PrivacyPolicies, TermsOfUse } from './components';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Tab } from '@mui/material';
import { RenderIf } from '@/components/common';
import { Permissions } from '@/data/role-access-data';

const PageTabs = {
  GENERAL: "GENERAL",
  CGU: "CGU",
  PRIVACY: "PRIVACY",
  MENTIONS: "MENTIONS",
  FAQS: "FAQS",
};

const Configurations = () => {
  const [currentTab, setCurrentTab] = useState(PageTabs.GENERAL);

  return (
    <RenderIf allowedTo={Permissions.VIEW_SYSTEM_CONFIGS}>
      <div className="mt-12 flex-1 w-full flex flex-col">
        <Card>
          <CardHeader variant="gradient" className="mb-2 p-6 h-[70px] bg-blue-300 flex flex-row justify-between items-center">
            <Typography variant="h6" color="blue-gray" >
              Configurations du système
            </Typography>
          </CardHeader>
          <CardBody className="p-4 pt-3 pb-[50px] h-[calc(100vh-210px)] overflow-auto shadow-none">
            <TabContext value={currentTab}>
              <TabList onChange={(_, value) => setCurrentTab(value)}>
                <Tab label="Infos Générales" value={PageTabs.GENERAL} />
                <Tab label="Conditions Générales d'Utilisation" value={PageTabs.CGU} />
                <Tab label="Politiques de confidentialité" value={PageTabs.PRIVACY} />
                <Tab label="Mentions légales" value={PageTabs.MENTIONS} />
                <Tab label="FAQs" value={PageTabs.FAQS} />
              </TabList>
              <TabPanel value={PageTabs.GENERAL}>
                <RenderIf allowedTo={Permissions.VIEW_GENERAL_INFORMATIONS_CONFIGS}>
                  <InfosGenerales />
                </RenderIf>
              </TabPanel>
              <TabPanel value={PageTabs.CGU} >
                <TermsOfUse />
              </TabPanel>
              <TabPanel value={PageTabs.PRIVACY}>
                <PrivacyPolicies />
              </TabPanel>
              <TabPanel value={PageTabs.MENTIONS}>
                <MentionsLegales />
              </TabPanel>
              <TabPanel value={PageTabs.FAQS}>
                <Faqs />
              </TabPanel>
            </TabContext>
          </CardBody>
        </Card>
      </div>
    </RenderIf>
  );
};

export default Configurations;
