export interface Record {
    [x: string]: any;
}
export default function omit(obj: Record | null | undefined, keysToOmit: string[]): Record;
