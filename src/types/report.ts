type TopProduct = {
    productName: string;
    quantity: number;
};

export type ChartsData = {
    month: string;
    total: number;
    topProducts: TopProduct[];
};
