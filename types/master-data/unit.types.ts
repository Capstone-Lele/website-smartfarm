export type Unit = {
    id: string;
    name: string;
};

export type UnitRequest = {
    name: string;
};

export type UnitResponse = {
    success: boolean;
    message: string;
    data: Unit[];
};