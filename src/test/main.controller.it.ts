import request from 'supertest';
import { IUser, User } from '../orm/entity/user';
import { app } from './init.app';
import { TestDataSource } from './test.datasource';
import { components } from '../types/schema';

type SalaryResponse = components['schemas']['SalaryResponse'];

const userRepository = TestDataSource.getRepository<IUser>(User);

const cleanUp = async () => {
  await userRepository.createQueryBuilder().delete().from(User).execute();
};

describe('slice dice tests', () => {
  const dataSet = [
    {
      name: 'Abhishek',
      salary: '145000',
      currency: 'USD',
      department: 'Engineering',
      sub_department: 'Platform',
    },
    {
      name: 'Anurag',
      salary: '90000',
      currency: 'USD',
      department: 'Banking',
      on_contract: 'true',
      sub_department: 'Loan',
    },
    {
      name: 'Himani',
      salary: '240000',
      currency: 'USD',
      department: 'Engineering',
      sub_department: 'Platform2',
    },
    {
      name: 'Yatendra',
      salary: '30',
      currency: 'USD',
      department: 'Operations',
      sub_department: 'CustomerOnboarding',
    },
    {
      name: 'Ragini',
      salary: '30',
      currency: 'USD',
      department: 'Engineering',
      sub_department: 'Platform',
    },
    {
      name: 'Nikhil',
      salary: '110000',
      currency: 'USD',
      on_contract: 'true',
      department: 'Engineering',
      sub_department: 'Platform',
    },
    {
      name: 'Guljit',
      salary: '30',
      currency: 'USD',
      department: 'Administration',
      sub_department: 'Agriculture',
    },
    {
      name: 'Himanshu',
      salary: '70000',
      currency: 'EUR',
      department: 'Operations',
      sub_department: 'CustomerOnboarding',
    },
    {
      name: 'Anupam',
      salary: '200000000',
      currency: 'INR',
      department: 'Engineering',
      sub_department: 'Platform',
    },
  ];

  beforeAll(async () => {
    await TestDataSource.initialize();
  });

  beforeEach(async () => {
    await cleanUp();
  });

  afterAll(async () => {
    await cleanUp();
  });

  function appendTestPassword(requestObject: any) {
    return {
      ...requestObject,
      password: 'test',
    };
  }

  describe('User Operations IT', () => {
    it('should return 201 on creating a user', async () => {
      // given
      const dataModifiedSet = [];
      const responseList = [];

      // when
      for (const requestObject of dataSet) {
        const requestObjectWithPassword = appendTestPassword(requestObject);
        dataModifiedSet.push(requestObjectWithPassword);
      }
      console.log(dataModifiedSet);
      const response = await request(app)
        .post('/auth/register')
        .send(dataModifiedSet)
        .set('Accept', 'application/json');
      responseList.push(response);

      // then
      expect(responseList[0].statusCode).toBe(201);
    });

    it('should return 204 on deleting the user', async () => {
      // given
      const dataModifiedSet = [];
      const dataSetForDeletionTest = [
        {
          name: 'AnupamTest',
          salary: '200000000',
          currency: 'INR',
          department: 'Engineering',
          sub_department: 'Platform',
        },
      ];
      for (const requestObject of dataSetForDeletionTest) {
        const requestObjectWithPassword = appendTestPassword(requestObject);
        dataModifiedSet.push(requestObjectWithPassword);
      }
      await request(app).post('/auth/register').send(dataModifiedSet).set('Accept', 'application/json');

      // when
      const response = await request(app)
        .delete('/auth/register')
        .send(dataModifiedSet)
        .set('Accept', 'application/json');

      expect(response.statusCode).toBe(204);
    });

    it('should return 500 if the user duplicates', async () => {
      // given
      const dataModifiedSet = [];
      const responseList = [];
      const dataSetForDuplicationTest = [
        {
          name: 'AnupamTest',
          salary: '200000000',
          currency: 'INR',
          department: 'Engineering',
          sub_department: 'Platform',
        },
      ];
      for (const requestObject of dataSetForDuplicationTest) {
        const requestObjectWithPassword = appendTestPassword(requestObject);
        dataModifiedSet.push(requestObjectWithPassword);
      }

      // when
      await request(app).post('/auth/register').send(dataModifiedSet).set('Accept', 'application/json');

      const response = await request(app)
        .post('/auth/register')
        .send(dataModifiedSet)
        .set('Accept', 'application/json');
      responseList.push(response);

      // then
      expect(responseList[0].statusCode).toBe(500);
    });

    it('should return 401 when the expired token provided', async () => {
      // given
      const responseList = [];
      const expiredToken =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoiOWM2NzM4ZDctZjdkYy00M2NlLTlhNmQtOTAwYjc3ZDE2ZjIyIiwiY3JlYXRlZEF0IjoiMjAyMi0xMi0wNFQxMjozMDowMi4wMDBaIiwidXBkYXRlZEF0IjoiMjAyMi0xMi0wNFQxMjozMDowMi4wMDBaIiwiZGVsZXRlZEF0IjpudWxsLCJuYW1lIjoidGVzdDQ0QHRlc3QuY29tIiwib25Db250cmFjdCI6dHJ1ZSwicHJpdmlsZWdlcyI6W3siaWQiOiI0YTZhZDFiNi04NjhkLTRjNjctOTNmMi1kMjFkYTEyYjlhZDkiLCJjcmVhdGVkQXQiOiIyMDIyLTEyLTA0VDEyOjMwOjAyLjAwMFoiLCJ1cGRhdGVkQXQiOiIyMDIyLTEyLTA0VDEyOjMwOjAyLjAwMFoiLCJkZWxldGVkQXQiOm51bGwsImVudGl0eSI6IlVzZXIiLCJhZG1pbiI6dHJ1ZX1dfSwiaWF0IjoxNjcwMTU3MDAyLCJleHAiOjE2NzAxNTc2MDJ9.OrUNQ-TAZSH6xQTmTfDWP1hRGI7s8wOtF9pAn07KTEM';

      // when
      const response = await request(app)
        .get('/auth/users')
        .set('Authorization', `Bearer ${expiredToken}`)
        .set('Accept', 'application/json');
      responseList.push(response);

      // then
      expect(responseList[0].statusCode).toBe(401);
    });
  });

  describe('Salary Operations IT', () => {
    it('should return the salary statistics', async () => {
      // given
      const dataModifiedSet = [];

      // when
      for (const requestObject of dataSet) {
        const requestObjectWithPassword = appendTestPassword(requestObject);
        dataModifiedSet.push(requestObjectWithPassword);
      }
      console.log(dataModifiedSet);
      await request(app).post('/auth/register').send(dataModifiedSet).set('Accept', 'application/json');

      // when
      const response = await request(app)
        .get('/auth/statistics')
        .send(dataModifiedSet)
        .set('Accept', 'application/json');

      // then
      expect(response.statusCode).toBe(200);
    });

    it('should return the salary statistics by on contract filter', async () => {
      // given
      const dataModifiedSet = [];

      // when
      for (const requestObject of dataSet) {
        const requestObjectWithPassword = appendTestPassword(requestObject);
        dataModifiedSet.push(requestObjectWithPassword);
      }
      await request(app).post('/auth/register').send(dataModifiedSet).set('Accept', 'application/json');

      // when
      const response = await request(app)
        .get('/auth/statistics?contract=true')
        .send(dataModifiedSet)
        .set('Accept', 'application/json');

      // then
      expect(response.statusCode).toBe(200);
    });

    it('should return the salary statistics by the department', async () => {
      // given
      const dataModifiedSet = [];
      const expectedCalculationItem: SalaryResponse[] = [
        {
          department_name: 'Administration',
          averageSalary: 30,
          minSalary: 30,
          maxSalary: 30,
        },
        {
          department_name: 'Banking',
          averageSalary: 90000,
          minSalary: 90000,
          maxSalary: 90000,
        },
        {
          department_name: 'Engineering',
          averageSalary: 40099006,
          minSalary: 30,
          maxSalary: 200000000,
        },
        {
          department_name: 'Operations',
          averageSalary: 35015,
          minSalary: 30,
          maxSalary: 70000,
        },
      ];

      // when
      for (const requestObject of dataSet) {
        const requestObjectWithPassword = appendTestPassword(requestObject);
        dataModifiedSet.push(requestObjectWithPassword);
      }
      await request(app).post('/auth/register').send(dataModifiedSet).set('Accept', 'application/json');

      // when
      let responseBody: SalaryResponse[] = [];
      await request(app)
        .get('/auth/statistics?department=true')
        .send(dataModifiedSet)
        .set('Accept', 'application/json')
        .expect(200)
        .then((response) => {
          responseBody = response.body;
        });

      // then
      expect(responseBody).toEqual(expectedCalculationItem);
    });

    it('should return the salary statistics by department and subDepartment', async () => {
      // given
      const dataModifiedSet = [];

      // when
      for (const requestObject of dataSet) {
        const requestObjectWithPassword = appendTestPassword(requestObject);
        dataModifiedSet.push(requestObjectWithPassword);
      }
      await request(app).post('/auth/register').send(dataModifiedSet).set('Accept', 'application/json');

      // when
      const response = await request(app)
        .get('/auth/statistics?subDepartment=true')
        .send(dataModifiedSet)
        .set('Accept', 'application/json');

      // then
      expect(response.statusCode).toBe(200);
    });
  });
});
