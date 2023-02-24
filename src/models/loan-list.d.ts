
export type LoanListModel = {
    id?: number | string | undefined;
    fullName?: string;
    phone?: string;
    date?: string;
    service?: string;
    amount?: string;
    roseAmount?: string;
};

export type LoanBillModel = {
    key?: string;
    value?: string;
    color?: string;
}

export type LoanBillModelArray = {
   arrayBill: LoanBillModel[]
}
