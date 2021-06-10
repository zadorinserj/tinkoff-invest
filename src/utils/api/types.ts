export type Currency = "RUB" | "USD" | "EUR" | "GBP" | "HKD" | "CHF" | "JPY" | "CNY" | "TRY";
export type InstrumentType = "Stock" | "Currency" | "Bond" | "Etf";
export type Depth = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

export type MarketInstrument = {
    figi: string;
    ticker: string;
    isin?: string;
    minPriceIncrement?: number;
    lot: number;
    minQuantity?: number;
    currency?: Currency;
    name: string;
    type: InstrumentType;
};

export type OperationStatus = "Done" | "Decline" | "Progress";
export type OperationTrade = {
    tradeId: string;
    date: string;
    price: number;
    quantity: number;
};
export type MoneyAmount = {
    currency: Currency;
    value: number;
};
export type OperationTypeWithCommission = "Buy" | "BuyCard" | "Sell" | "BrokerCommission" | "ExchangeCommission" | "ServiceCommission" | "MarginCommission" | "OtherCommission" | "PayIn" | "PayOut" | "Tax" | "TaxLucre" | "TaxDividend" | "TaxCoupon" | "TaxBack" | "Repayment" | "PartRepayment" | "Coupon" | "Dividend" | "SecurityIn" | "SecurityOut";

export type Operation = {
    id: string;
    status: OperationStatus;
    trades?: OperationTrade[];
    commission?: MoneyAmount;
    currency: Currency;
    payment: number;
    price?: number;
    quantity?: number;
    quantityExecuted?: number;
    figi?: string;
    instrumentType?: InstrumentType;
    isMarginCall: boolean;
    date: string;
    operationType?: OperationTypeWithCommission;
};

export type Operations = {
    operations: Operation[];
};

export type CurrencyPosition = {
    currency: Currency;
    balance: number;
    blocked?: number;
};

export type Currencies = {
    currencies: CurrencyPosition[];
};

export type OrderResponse = {
    price: number;
    quantity: number;
};

export type TradeStatus = "NormalTrading" | "NotAvailableForTrading";

export type OrderBook = {
    figi: string;
    depth: number;
    bids: OrderResponse[];
    asks: OrderResponse[];
    tradeStatus: TradeStatus;
    minPriceIncrement: number;
    faceValue?: number;
    lastPrice?: number;
    closePrice?: number;
    limitUp?: number;
    limitDown?: number;
};
