import {Component, Input, OnInit} from '@angular/core';
import {ClientMgmService} from "../../shared/services/client-mgm.service";
import {Product} from "../../shared/models/product";
import {SearchResponse} from "../../shared/dto/search-response";
import {Client} from "../../shared/models/client";
import {LazyRequest} from "../../shared/dto/lazy-request";

@Component({
  selector: 'app-client-mgm-favorites',
  templateUrl: './client-mgm-favorites.component.html',
  styleUrls: ['./client-mgm-favorites.component.scss']
})
export class ClientMgmFavoritesComponent implements OnInit {

  @Input() client: Client;

  wishRequest: LazyRequest = new LazyRequest();
  wishResponse: SearchResponse<Product>;

  constructor(
    private clientService: ClientMgmService,
  ) { }

  ngOnInit() {
    this.wishRequest = new LazyRequest();
    this.wishRequest.page = 1;
    this.wishRequest.pageSize = 10;
    this.getWishList();
  }

  getWishList(replaceList: boolean = true) {
    this.clientService.getWishListByClient(this.wishRequest, this.client.clientId)
      .then((response) => {
        if (replaceList) {
          this.wishResponse = response;
        }
        else {
          this.wishResponse.data = this.wishResponse.data.concat(response.data);
        }
      })
      .catch((error) => {
        console.log("error = ", error);
      });
  }

  onScroll() {
    console.log('paginated!');
    this.wishRequest.page++
    if (this.wishRequest.page <= this.wishResponse.totalPages) {
      this.getWishList(false);
    }
  }

}
