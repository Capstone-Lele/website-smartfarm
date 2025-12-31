export type Kategori = {
    id: string;
    name: string;
};

export type KategoriResponse = {
    success: boolean;
    message: string;
    data: Kategori[];
};