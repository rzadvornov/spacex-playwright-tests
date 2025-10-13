import { DestinationsSteps } from "../../step-definitions/ui/DestinationsSteps";
import { FooterSteps } from "../../step-definitions/ui/FooterSteps";
import { HomePageSteps } from "../../step-definitions/ui/HomePageSteps";
import { HumanSpaceflightSteps } from "../../step-definitions/ui/HumanSpaceflightSteps";
import { SharedPageSteps } from "../../step-definitions/ui/SharedPageSteps";
import { HomePage } from "../ui/HomePage";
import { HumanSpaceflightPage } from "../ui/HumanSpaceflightPage";
import { SharedContext } from "./SharedContext";

export type BddFixtures = {
  sharedContext: SharedContext;
  sharedPageSteps: SharedPageSteps;
  homePage: HomePage;
  homePageSteps: HomePageSteps;
  humanSpaceflightPage: HumanSpaceflightPage;
  humanSpaceflightSteps: HumanSpaceflightSteps;
  footerSteps: FooterSteps;
  destinationsSteps: DestinationsSteps;
};