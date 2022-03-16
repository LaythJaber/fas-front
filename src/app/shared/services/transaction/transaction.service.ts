import {Injectable} from "@angular/core";
import {environment} from "../../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {Transaction} from "../../models/transaction/transaction";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  TRANSACTION_API = environment.api + '/transactions';

  constructor(
    private http: HttpClient
  ) {
  }

  getPurchaseTransactions(purchaseId: number) {
    return this.http.get<Transaction[]>(`${this.TRANSACTION_API}/purchase?id=${purchaseId}`);
  }

}
