declare module 'mongodb' {
    export class ObjectId {
        constructor(id?: string | number | ObjectId);
        toString(): string;
        toHexString(): string;
        equals(otherId: string | ObjectId | number): boolean;
    }
}