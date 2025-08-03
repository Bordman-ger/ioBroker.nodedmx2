declare module "dmx";

export type FlatStateValue = string | number | boolean;
export type StateValue = FlatStateValue | any[] | Record<string, any>;

export type OldStateValue = StateValue | null | undefined;
export type CurrentStateValue = StateValue | null;
export type StateChangeListener = (oldValue: OldStateValue, newValue: CurrentStateValue) => void;
export type StateEventHandler = (value: any) => void;
export type StateEventRegistration = { name?: string; handler: StateEventHandler };
export type NamedStateEventHandler = (id: string, value: any) => void;
