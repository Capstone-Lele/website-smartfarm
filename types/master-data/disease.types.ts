export type Disease = {
    id: string;
    name: string;
    description: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export type DiseaseResponse = {
    success: boolean;
    message: string;
    data: Disease[];
}

export type DiseaseFormInput = {
    name?: string;
    description?: string;
}