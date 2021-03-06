import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { map, Observable, of } from 'rxjs';
import { HttpHeaders } from '@angular/common/http'

@Injectable({
	providedIn: 'root'
})
export class DataService {

	private route = 'http://universities.hipolabs.com/search';
	uniData: University[];

	constructor(
		private http: HttpClient,
	) { }

	getData(d: { index: number, itemPerPage: number, name?: string }): Observable<Response<University[]>> {

		if (this.uniData !== undefined) {
			let filterData = this.uniData;
			let modifyData = this.uniData;
			if (d.name !== undefined && d.name) {
				filterData = filterData.filter(res => res.name.toLowerCase().includes((d.name?.toLowerCase()) as string))
			}
			modifyData = filterData.slice(d.index * d.itemPerPage, (d.index + 1) * d.itemPerPage);
			return of(
				{
					data: modifyData,
					total: d.name !== undefined && d.name ? filterData.length : this.uniData.length,
					index: d.index || 0,
					itemPerPage: d.itemPerPage || 10
				}
			)
		}

		let params: any = {
			country: 'United States',
		}

		if (d.name) {
			params['name'] = d.name
		}

		const requestOptions = {
			params: params
		};


		return this.http.get<University[]>(this.route, requestOptions)
			.pipe(map(res => {
				this.uniData = JSON.parse(JSON.stringify(res));
				return {
					data: res.slice(d.index, (d.index + 1) * d.itemPerPage),
					total: res.length,
					index: d.index || 0,
					itemPerPage: d.itemPerPage || 10
				}
			}
			))
	}
}

export interface Response<T> {
	data: T;
	total: number;
	index: number;
	itemPerPage: number;
}

export interface University {
	alpha_two_code: string;
	domains: string[];
	'web_pages': string[];
	country: string;
	'state-province': string;
	name: string
}
