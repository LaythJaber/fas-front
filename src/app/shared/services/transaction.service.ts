import {Injectable} from "@angular/core";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";
import {SearchResponse} from "../dto/search-response";
import {TransactionPageRequest} from "../models/transaction/transaction-page-request";
import {Transaction} from "../models/transaction/transaction";

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  TRANSACTION_API = environment.api + '/transactions';

  constructor(
    private http: HttpClient
  ) {
  }

  getLazyTransactions(request: TransactionPageRequest) {
    return this.http.post<SearchResponse<Transaction>>(`${this.TRANSACTION_API}/filter`, request);
  }

  getTransactionDetails(transId: number) {
    return this.http.get<Transaction>(`${this.TRANSACTION_API}/details/${transId}`);
  }

}
