export interface DataProviderStatusType {
  IsProviderEnabled: boolean;
  ID: number;
  Title: string;
}

export interface DataProvider {
  WebsiteURL: string;
  Comments?: any;
  DataProviderStatusType: DataProviderStatusType;
  IsRestrictedEdit: boolean;
  IsOpenDataLicensed: boolean;
  IsApprovedImport: boolean;
  License: string;
  DateLastImported?: any;
  ID: number;
  Title: string;
}

export interface OperatorInfo {
  WebsiteURL: string;
  Comments?: any;
  PhonePrimaryContact: string;
  PhoneSecondaryContact?: any;
  IsPrivateIndividual?: any;
  AddressInfo?: any;
  BookingURL?: any;
  ContactEmail: string;
  FaultReportEmail: string;
  IsRestrictedEdit?: any;
  ID: number;
  Title: string;
}

export interface UsageType {
  IsPayAtLocation?: boolean;
  IsMembershipRequired?: boolean;
  IsAccessKeyRequired?: boolean;
  ID: number;
  Title: string;
}

export interface StatusType {
  IsOperational: boolean;
  IsUserSelectable: boolean;
  ID: number;
  Title: string;
}

export interface SubmissionStatus {
  IsLive: boolean;
  ID: number;
  Title: string;
}

export interface CommentType {
  ID: number;
  Title: string;
}

export interface User {
  ID: number;
  IdentityProvider?: any;
  Identifier?: any;
  CurrentSessionToken?: any;
  Username: string;
  Profile?: any;
  Location?: any;
  WebsiteURL?: any;
  ReputationPoints: number;
  Permissions?: any;
  PermissionsRequested?: any;
  DateCreated?: any;
  DateLastLogin?: any;
  IsProfilePublic?: any;
  IsEmergencyChargingProvider?: any;
  IsPublicChargingProvider?: any;
  Latitude?: any;
  Longitude?: any;
  EmailAddress?: any;
  EmailHash?: any;
  ProfileImageURL: string;
  IsCurrentSessionTokenValid?: any;
  APIKey?: any;
  SyncedSettings?: any;
}

export interface CheckinStatusType {
  IsPositive: boolean;
  IsAutomatedCheckin: boolean;
  ID: number;
  Title: string;
}

export interface UserComment {
  ID: number;
  ChargePointID: number;
  CommentTypeID: number;
  CommentType: CommentType;
  UserName: string;
  Comment: string;
  Rating?: number;
  RelatedURL?: any;
  DateCreated: Date;
  User: User;
  CheckinStatusTypeID: number;
  CheckinStatusType: CheckinStatusType;
  IsActionedByEditor?: boolean;
}

export interface User2 {
  ID: number;
  IdentityProvider?: any;
  Identifier?: any;
  CurrentSessionToken?: any;
  Username: string;
  Profile?: any;
  Location?: any;
  WebsiteURL?: any;
  ReputationPoints: number;
  Permissions?: any;
  PermissionsRequested?: any;
  DateCreated?: any;
  DateLastLogin?: any;
  IsProfilePublic?: any;
  IsEmergencyChargingProvider?: any;
  IsPublicChargingProvider?: any;
  Latitude?: any;
  Longitude?: any;
  EmailAddress?: any;
  EmailHash?: any;
  ProfileImageURL: string;
  IsCurrentSessionTokenValid?: any;
  APIKey?: any;
  SyncedSettings?: any;
}

export interface MediaItem {
  ID: number;
  ChargePointID: number;
  ItemURL: string;
  ItemThumbnailURL: string;
  Comment: string;
  IsEnabled: boolean;
  IsVideo: boolean;
  IsFeaturedItem: boolean;
  IsExternalResource: boolean;
  MetadataValue?: any;
  User: User2;
  DateCreated: Date;
}

export interface Country {
  ISOCode: string;
  ContinentCode: string;
  ID: number;
  Title: string;
}

export interface AddressInfo {
  ID: number;
  Title: string;
  AddressLine1: string;
  AddressLine2: string;
  Town: string;
  StateOrProvince: string;
  Postcode: string;
  CountryID: number;
  Country: Country;
  Latitude: number;
  Longitude: number;
  ContactTelephone1: string;
  ContactTelephone2?: any;
  ContactEmail?: any;
  AccessComments: string;
  RelatedURL: string;
  Distance?: any;
  DistanceUnit: number;
}

export interface ConnectionType {
  FormalName: string;
  IsDiscontinued?: boolean;
  IsObsolete?: boolean;
  ID: number;
  Title: string;
}

export interface StatusType2 {
  IsOperational: boolean;
  IsUserSelectable: boolean;
  ID: number;
  Title: string;
}

export interface Level {
  Comments: string;
  IsFastChargeCapable: boolean;
  ID: number;
  Title: string;
}

export interface CurrentType {
  Description: string;
  ID: number;
  Title: string;
}

export interface Connection {
  ID: number;
  ConnectionTypeID: number;
  ConnectionType: ConnectionType;
  Reference?: any;
  StatusTypeID?: number;
  StatusType: StatusType2;
  LevelID: number;
  Level: Level;
  Amps?: number;
  Voltage?: number;
  PowerKW: number;
  CurrentTypeID?: number;
  CurrentType: CurrentType;
  Quantity?: number;
  Comments: string;
}

export interface OpenChargeMapOBJ {
  DataProvider: DataProvider;
  OperatorInfo: OperatorInfo;
  UsageType: UsageType;
  StatusType: StatusType;
  SubmissionStatus: SubmissionStatus;
  UserComments: UserComment[];
  PercentageSimilarity?: any;
  MediaItems: MediaItem[];
  IsRecentlyVerified: boolean;
  DateLastVerified?: Date;
  ID: number;
  UUID: string;
  ParentChargePointID?: any;
  DataProviderID: number;
  DataProvidersReference?: any;
  OperatorID: number;
  OperatorsReference?: any;
  UsageTypeID: number;
  UsageCost: string;
  AddressInfo: AddressInfo;
  Connections: Connection[];
  NumberOfPoints: number;
  GeneralComments: string;
  DatePlanned?: any;
  DateLastConfirmed?: any;
  StatusTypeID: number;
  DateLastStatusUpdate: Date;
  MetadataValues?: any;
  DataQualityLevel: number;
  DateCreated: Date;
  SubmissionStatusTypeID: number;
}


