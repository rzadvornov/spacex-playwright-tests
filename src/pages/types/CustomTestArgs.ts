import { PlaywrightTestArgs } from "@playwright/test";
import { BddFixtures } from "./BddFixtures";
import { ConsoleErrorFixture } from "./ConsoleErrorFixture";

export interface CustomTestArgs
  extends PlaywrightTestArgs,
    BddFixtures,
    ConsoleErrorFixture {}
