export type RequestInventorySubmission = {
    feedback?: string;

    /*  Transaction Section */
    /**
     * required if status equal to approved
     */
    image?: string;
    /**
     * required if status equal to approved
     */
    pricePerItem?: number;
    /**
     * pending | rejected | approved
     */
    status: string;
    /**
     * required if status equal to approved
     */
    totalPrice?: number;
    /**
     * required if status equal to approved
     */
    transactionDate?: string;
    /**
     * required if status equal to approved
     */
    transactionNotes?: string;
}