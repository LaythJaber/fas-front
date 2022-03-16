export class ReportStatics {
  id: number;
  seq: number;
  barCode: string;
  description: string;
  categoryDescription: string;
  salesQuantity: number;
  salesValue: number;
  profitValue: number;
  monthlyReports: MonthlyReports[];
}

export class MonthlyReports {
  creatAt: Date;
  salesQuantity: number;
  salesValue: number;
  profitValue: number;
}
