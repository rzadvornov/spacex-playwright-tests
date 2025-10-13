import {
  AssistiveTechRequirement,
  CoreElement,
  CoreRequirement,
  CoreValue,
  CriticalContent,
  DestinationInfo,
  Element,
  HeadingExpectation,
  InteractiveState,
  LandmarkExpectation,
  LayoutRequirement,
  MediaTile,
  MetadataItem,
  MissionMetric,
  MissionTab,
  MobileAction,
  NavigationLink,
  NavigationRequirement,
  Requirement,
  RequirementMetric,
  SocialMediaTag,
  SpacingRequirement,
  StructureCheck,
  StyleRequirement,
} from "./Types";

type DataTableRow = Record<string, string>;

class TypeSafeParser {
  private static validateRequiredProperties(
    obj: DataTableRow,
    requiredProps: string[],
    typeName: string
  ): void {
    const missingProps = requiredProps.filter(
      (prop) => !(prop in obj) || obj[prop] === undefined
    );
    if (missingProps.length > 0) {
      throw new Error(
        `Invalid ${typeName} structure. Missing properties: ${missingProps.join(
          ", "
        )}`
      );
    }
  }

  public static createParser<T>(
    requiredProps: string[],
    typeName: string,
    mapper?: (obj: DataTableRow) => T
  ) {
    return (data: DataTableRow[]): T[] => {
      const validData: T[] = [];

      for (const [index, row] of data.entries()) {
        try {
          this.validateRequiredProperties(row, requiredProps, typeName);
          validData.push(mapper ? mapper(row) : (row as unknown as T));
        } catch (error) {
          console.warn(
            `Skipping invalid ${typeName.toLowerCase()} at index ${index}:`,
            row,
            error
          );
        }
      }

      return validData;
    };
  }
}

export const parseHeadingExpectations =
  TypeSafeParser.createParser<HeadingExpectation>(
    ["Level", "Content", "Count"],
    "heading expectation"
  );

export const parseAccessibilityRequirements =
  TypeSafeParser.createParser<Requirement>(
    ["Requirement"],
    "accessibility requirement"
  );

export const parseLandmarkExpectations =
  TypeSafeParser.createParser<LandmarkExpectation>(
    ["Type"],
    "landmark expectation"
  );

export const parseDestinationInfo =
  TypeSafeParser.createParser<DestinationInfo>(
    ["Destination", "Path", "Element Type"],
    "destination info"
  );

export const parseNavigationLinks = TypeSafeParser.createParser<NavigationLink>(
  ["Primary Links", "Secondary Elements"],
  "navigation link"
);

export const parseLayoutRequirements =
  TypeSafeParser.createParser<LayoutRequirement>(
    ["Element", "Position"],
    "layout requirement"
  );

export const parseSpacingRequirements =
  TypeSafeParser.createParser<SpacingRequirement>(
    ["Spacing Type"],
    "spacing requirement"
  );

export const parseStyleRequirements =
  TypeSafeParser.createParser<StyleRequirement>(
    ["Style Element"],
    "style requirement"
  );

export const parseBackgroundCharacteristics =
  TypeSafeParser.createParser<Element>(
    ["Element"],
    "background characteristic"
  );

export const parseInteractiveStates =
  TypeSafeParser.createParser<InteractiveState>(["State"], "interactive state");

export const parseCoreRequirements =
  TypeSafeParser.createParser<CoreRequirement>(
    ["Element", "Requirement"],
    "core requirement"
  );

export const parseCriticalContent =
  TypeSafeParser.createParser<CriticalContent>(
    ["Content Type"],
    "critical content"
  );

export const parseMetadataItems = TypeSafeParser.createParser<MetadataItem>(
  ["Element", "Content"],
  "metadata item"
);

export const parseSocialMediaTags = TypeSafeParser.createParser<SocialMediaTag>(
  ["Platform"],
  "social media tag"
);

export const parseWcagStandards = TypeSafeParser.createParser<Requirement>(
  ["Requirement"],
  "WCAG standard"
);

export const parseAssistiveTechRequirements =
  TypeSafeParser.createParser<AssistiveTechRequirement>(
    ["Support Type"],
    "assistive tech requirement"
  );

export const parseCoreValues = TypeSafeParser.createParser<CoreValue>(
  ["Element", "Value"],
  "core value"
);

export const parseHeaderElements = TypeSafeParser.createParser<Element>(
  ["Element"],
  "header element"
);

export const parseMobileActions = TypeSafeParser.createParser<MobileAction>(
  ["Action", "Verification"],
  "mobile action"
);

export const parsePerformanceMetrics =
  TypeSafeParser.createParser<RequirementMetric>(
    ["Metric", "Requirement"],
    "performance metric"
  );

export const parseMediaTiles = TypeSafeParser.createParser<MediaTile>(
  ["Title", "Type", "Media Type"],
  "media tile"
);

export const parseMissionTabs = TypeSafeParser.createParser<MissionTab>(
  ["Tab Name", "Order"],
  "mission tab"
);

export const parseMissionMetrics = TypeSafeParser.createParser<MissionMetric>(
  ["Metric", "Value"],
  "mission metric"
);

export const parseStructureChecks = TypeSafeParser.createParser<StructureCheck>(
  ["Element", "Default Tab"],
  "structure check"
);

export const parseCoreElements = TypeSafeParser.createParser<CoreElement>(
  ["Element", "Content", "Description", "State"],
  "core element"
);

export const parseNavigationRequirements = TypeSafeParser.createParser<NavigationRequirement>(
  ["URL", "Page Title", "Form"],
  "navigation requirement"
);

