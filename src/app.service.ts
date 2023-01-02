import { BadRequestException, Injectable } from '@nestjs/common';
import axios from 'axios';

interface Salary {
  from: number;
  to: number, 
  currency: string;
}

const getPageNavLink = (pageNumber: number, text: string) => `<div><a href='/?page=${pageNumber}'>${text}</a>`
const getSalary = ({from, to, currency}: Salary) => `(${[from, to].filter(Boolean).join('-')} ${currency})`

@Injectable()
export class AppService {
  async getVacancies(page: number) {

    try {
      const {data: {items=[], pages} = {}} = await axios.get('https://api.hh.ru/vacancies',{params: {page}});
  
      const list = items.reduce((result, {name, alternate_url, salary}) => result + `<li><a href=${alternate_url} target='_blank'>${name} ${salary ? getSalary(salary) : ''}</a></li>`, '<ul>') + '</ul>';
      const previous = page > 0 ? getPageNavLink(page - 1, '< Назад') : '';
      const next = page < pages - 1 ? getPageNavLink(page + 1, 'Дальше >'): '';
    
      return `<h3>Вакансии дня:</h3><main>${list}${previous}${next}</main>`
    } catch(error) {
      const status = error?.response?.status || 500;

      throw new BadRequestException({
        status,
        error: error?.response?.statusText || 'Internal server error',
      }, status)
    }
  }
}
