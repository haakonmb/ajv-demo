export enum AccessLevels {
  READ = 'read',
  WRITE = 'write',
  DELETE = 'delete',
}

export enum TokenTypes {
  /**
   * Admin tokens can be used by internal services to perform administrative tasks
   * They can ignore ownership and access restrictions on events
   * They can manage other tokens;
   * Now they are too powerful, you should only be allowed to preform the needed
   * actions that a service requires.
   */
  ADMIN = 'admin',
  /**
   * Owner tokens have full access to events that they own
   * and they can manage other tokens, to grant/revoke access to events they own
   *
   * This token is intended to only manage access, not to preform tasks on events, although they are able to.
   * If an owner want to preform tasks on events they own, they should create a delegated token.
   */
  OWNER = 'owner',
  /**
   * Delegated tokens have the same abilities as owner tokens, but they are not able to manage other tokens.
   * They give full access to all events that the owner own.
   * They can have multiple owners.
   */
  DELEGATED_OWNER = 'delegatedOwner',
  /**
   * Viewing tokens can only view events that they have access to.
   * The access is granted on a granular level, by assigning access categories.
   * Any event with the same access category will be accessible by the token.
   * Viewing tokens can only do read operations on events.
   */
  VIEWING_SERVICE = 'viewingService',
  /**
   * Granular access tokens are in principle as powerful as delegated owner tokens.
   * But the access is set with access categories.
   * You can set access categories for read, write, delete.
   * If an event have the same access category, the token will have access to it.
   */
  GRANULAR_ACCESS = 'granularAccess',
}

export enum ErrorCode {
  ASSIGNEE_NOT_FOUND = 'ASSIGNEE_NOT_FOUND',
  CATEGORY_IN_USE = 'CATEGORY_IN_USE',
  CATEGORY_NOT_FOUND = 'CATEGORY_NOT_FOUND',
  DUPLICATE_TYPE = 'DUPLICATE_TYPE',
  INVALID_TOKEN_PAYLOAD = 'INVALID_TOKEN_PAYLOAD',
  INVALID_REQUEST_TYPE = 'INVALID_REQUEST_TYPE',
  INVALID_REQUEST_OPERATION = 'INVALID_REQUEST_OPERATION',
  INVALID_TYPE = 'INVALID_TYPE',
  INVALID_ACCESS_LEVEL = 'INVALID_ACCESS_LEVEL',
  INVALID_ACCESS_ASSIGNMENT = 'INVALID_ACCESS_ASSIGNMENT',
  INVALID_TOKEN_TYPE = 'INVALID_TOKEN_TYPE',
  INVALID_TOKEN_NAME = 'INVALID_TOKEN_NAME',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  TOKEN_RECORD_NOT_FOUND = 'TOKEN_RECORD_NOT_FOUND',
  TOKEN_NOT_FOUND = 'TOKEN_NOT_FOUND',
  TOKEN_HAS_HIGHER_ACCESS_LEVEL = 'TOKEN_HAS_HIGHER_ACCESS_LEVEL',
  UNAUTHORIZED = 'UNAUTHORIZED',
}

export type ErrorResult = {
  code: ErrorCode;
  message?: string;
};

export type ErrorResponse<T> = [ErrorResult, null] | [null, T];
// export type Query = {
//   type: string;
//   operation: string;
//   accessCategory?: string;
//   tokenId?: string;
//   tokenType?: string;
//   authorisationLevel?: string;
//   name?: string;

//   // Can only be used by an admin request;
//   ownerId?: string;
// };

export type RecordResponseAccessLevels = {
  [key: string]: Record<string, string[]>;
};

export enum RecordSchemas {
  OWNER_DETAIL = 'OWNER_DETAIL',
  TOKEN_ACCESS_RECORD = 'TOKEN_ACCESS_RECORD',
}
type AllTypesButOwner = Exclude<TokenTypes, TokenTypes.OWNER>;

export type TokenRecordResponse =
  | {
      id: string;
      name: string;
      recordSchema: RecordSchemas.TOKEN_ACCESS_RECORD;
      fullDelegationsBy: string[];
      accessLevelBy: string[];
      accessLevels: RecordResponseAccessLevels;
      type: AllTypesButOwner;
    }
  | {
      id: string;
      name: string;
      recordSchema: RecordSchemas.TOKEN_ACCESS_RECORD;
      fullDelegationsBy: string[];
      accessLevelBy: [];
      accessLevels: Record<string, never>;
      type: TokenTypes.OWNER;
    };

export type GrantedFullDelegation = Record<string, string>[];
export type GrantedGranularAccess = Record<string, string>[];
export type GranularAccess = Record<string, Record<string, string>[]>;

export type OwnerDetailRecordResponse = {
  id: string;
  name: string;
  recordSchema: RecordSchemas.OWNER_DETAIL;
  grantedFullDelegation: GrantedFullDelegation;
  grantedGranularAccess: GrantedGranularAccess;
  allAccessCategories: string[];
  granularAccess: GranularAccess;
};

type QueryGetRecord = {
  type: 'AUTH_RECORD';
  operation: 'getRecord';
};

type QueryGetUserRecord = {
  type: 'AUTH_RECORD';
  operation: 'getUserRecord';
  tokenId: string;
};

export type QueryCreateOwnerToken = {
  type: 'AUTH_ACTION_ADMIN';
  operation: 'createOwnerToken';
  tokenId: string;
  name?: string;
};

export type QueryCreateViewerToken = {
  type: 'AUTH_ACTION_ADMIN';
  operation: 'createViewerToken';
  ownerId: string;
  tokenId: string;
  name?: string;
};

export type QueryCreateDelegatedToken = {
  type: 'AUTH_ACTION_ADMIN';
  operation: 'createDelegatedToken';
  ownerId: string;
  tokenId: string;
  name?: string;
};

export type QueryAddDelegate = {
  type: 'AUTH_ACTION';
  operation: 'addDelegate';
  tokenId: string;
  name?: string;
};

export type QueryAddGranularAccess = {
  type: 'AUTH_ACTION';
  operation: 'addGranularAccess';
  tokenId: string;
  name?: string;
};

export type QueryRemoveDelegate = {
  type: 'AUTH_ACTION';
  operation: 'removeDelegate';
  tokenId: string;
};

export type QueryAddViewer = {
  type: 'AUTH_ACTION';
  operation: 'addViewer';
  tokenId: string;
  name?: string;
};

export type QueryRemoveViewer = {
  type: 'AUTH_ACTION';
  operation: 'removeViewer';
  tokenId: string;
};

export type QueryAddAccessCategory = {
  type: 'AUTH_ACTION';
  operation: 'addAccessCategory';
  accessCategory: string;
};
export type QueryRemoveAccessCategory = {
  type: 'AUTH_ACTION';
  operation: 'removeAccessCategory';
  accessCategory: string;
};

export type QueryAddAccessCategoryToToken = {
  type: 'AUTH_ACTION';
  operation: 'addAccessCategoryToToken';
  tokenId: string;
  accessCategory: string;
  authorisationLevel?: AccessLevels;
};

export type QueryRemoveAccessCategoryFromToken = {
  type: 'AUTH_ACTION';
  operation: 'removeAccessCategoryFromToken';
  tokenId: string;
  accessCategory: string;
};

export type RecordQuery = QueryGetRecord | QueryGetUserRecord;

export type AdminQuery =
  | QueryCreateDelegatedToken
  | QueryCreateViewerToken
  | QueryCreateOwnerToken;

export type ActionQuery =
  | QueryAddDelegate
  | QueryAddGranularAccess
  | QueryRemoveDelegate
  | QueryAddViewer
  | QueryRemoveViewer
  | QueryAddAccessCategory
  | QueryRemoveAccessCategory
  | QueryAddAccessCategoryToToken
  | QueryRemoveAccessCategoryFromToken;

export type Query = RecordQuery | AdminQuery | ActionQuery;
