export type Unit = {
    id: string;
    name: string;
    deletedAt: string | null;
};

export type UnitRequest = {
    name: string;
};

export type UnitResponse = {
    success: boolean;
    message: string;
    data: Unit[];
};