import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as _ from 'lodash';
import { DataService, University, Response } from 'src/app/data.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'university-app';
	dataSource!: MatTableDataSource<University>;
	data!: Response<University[]>;
	displayedColumns: string[] =
		[
			'no',
			'alpha_two_code',
			'domains',
			'web_pages',
			'country',
			'state-province',
			'name'
		];
	params = {
		index: 0,
		itemPerPage: 10,
		name: ''
	}
	value: string = '';
	isLoading: boolean = true;

	constructor(
		private dataService: DataService,
		public ngxLoader: NgxUiLoaderService
	) { }

	ngOnInit(): void {
		this.getData();
	}

	getData(): void {
		this.ngxLoader.start();
		this.dataService.getData(this.params)
			.subscribe({
				next: res => {
					this.dataSource = new MatTableDataSource(res.data);
					this.data = res;
				},
				error: err => {
					alert("error, please contact to admin@syhue.com for further infos.")
				}
			})
			.add(
				() => {
					this.ngxLoader.stop();
				}
			)
	}

	changePage(item: any) {
		if (item.pageSize !== this.params.itemPerPage) {
			this.params = {
				index: 0,
				itemPerPage: item.pageSize,
				name: ''
			}
		}
		else {
			this.params = {
				index: item.pageIndex,
				itemPerPage: item.pageSize,
				name: ''
			}
		}

		this.getData();
	}

	search(): void {
		this.params = {
			index: 0,
			itemPerPage: this.params.itemPerPage,
			name: this.value
		}
		_.debounce(() => this.getData(), 1000)();
	}
}
