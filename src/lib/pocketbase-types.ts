/**
 * This file was @generated using pocketbase-typegen
 */

import type PocketBase from 'pocketbase';
import type { RecordService } from 'pocketbase';

export enum Collections {
    Answers = 'answers',
    Rooms = 'rooms',
    Surveys = 'surveys',
    Users = 'users',
}

// Alias types for improved usability
export type IsoDateString = string;
export type RecordIdString = string;
export type HTMLString = string;

// System fields
export type BaseSystemFields<T = never> = {
    id: RecordIdString;
    created: IsoDateString;
    updated: IsoDateString;
    collectionId: string;
    collectionName: Collections;
    expand?: T;
};

export type AuthSystemFields<T = never> = {
    email: string;
    emailVisibility: boolean;
    username: string;
    verified: boolean;
} & BaseSystemFields<T>;

// Record types for each collection

export type AnswersRecord<Tanswers = unknown, Tsurvey = unknown> = {
    answers?: null | Tanswers;
    name?: string;
    room?: RecordIdString;
    survey?: null | Tsurvey;
};

export enum RoomsStateOptions {
    'waiting' = 'waiting',
    'active' = 'active',
    'closed' = 'closed',
}
export type RoomsRecord = {
    banner?: string;
    code: string;
    owner: RecordIdString;
    state?: RoomsStateOptions;
    survey?: RecordIdString;
    title?: string;
};

export type SurveysRecord<Tquestions = unknown> = {
    owner: RecordIdString;
    questions?: null | Tquestions;
    title?: string;
};

export type UsersRecord = {
    gravatarhash: string;
    gravatar: boolean;
    displayname?: string;
};

// Response types include system fields and match responses from the PocketBase API
export type AnswersResponse<Tanswers = unknown, Tsurvey = unknown, Texpand = unknown> = Required<
    AnswersRecord<Tanswers, Tsurvey>
> &
    BaseSystemFields<Texpand>;
export type RoomsResponse<Texpand = unknown> = Required<RoomsRecord> & BaseSystemFields<Texpand>;
export type SurveysResponse<Tquestions = unknown, Texpand = unknown> = Required<SurveysRecord<Tquestions>> &
    BaseSystemFields<Texpand>;
export type UsersResponse<Texpand = unknown> = Required<UsersRecord> & AuthSystemFields<Texpand>;

// Types containing all Records and Responses, useful for creating typing helper functions

export type CollectionRecords = {
    answers: AnswersRecord;
    rooms: RoomsRecord;
    surveys: SurveysRecord;
    users: UsersRecord;
};

export type CollectionResponses = {
    answers: AnswersResponse;
    rooms: RoomsResponse;
    surveys: SurveysResponse;
    users: UsersResponse;
};

// Type for usage with type asserted PocketBase instance
// https://github.com/pocketbase/js-sdk#specify-typescript-definitions

export type TypedPocketBase = PocketBase & {
    collection(idOrName: 'answers'): RecordService<AnswersResponse>;
    collection(idOrName: 'rooms'): RecordService<RoomsResponse>;
    collection(idOrName: 'surveys'): RecordService<SurveysResponse>;
    collection(idOrName: 'users'): RecordService<UsersResponse>;
};
