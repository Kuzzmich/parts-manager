import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { asyncWrapProviders } from 'node:async_hooks';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  afterEach(async () => {
    await app.close();
  });
});

describe('Equipment (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  let token: string;
  let clientId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ transform: true }));
    await app.init();

    prisma = moduleFixture.get<PrismaService>(PrismaService);
  });

  beforeEach(async () => {
    // очищаем таблицы перед каждым тестом
    await prisma.db.equipment.deleteMany();
    await prisma.db.client.deleteMany();
    await prisma.db.manager.deleteMany();

    const authRes = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'test@test.com', password: '123456', name: 'Test' });

    token = authRes.body.access_token;

    const clientRes = await request(app.getHttpServer())
      .post('/clients')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Test Client' });

    clientId = clientRes.body.id;
  });

  afterAll(async () => {
    await app.close();
  });

  it('create equipment', async () => {
    const equipment = {
      clientId,
      brand: 'Kamatsu',
      model: 'PC200',
      year: 2020,
      serialNumber: '1234567890',
      notes: 'Good condition',
    };

    const createRes = await request(app.getHttpServer())
      .post(`/clients/${clientId}/equipment`)
      .set('Authorization', `Bearer ${token}`)
      .send(equipment);

    expect(createRes.status).toBe(201);
  });

  it('should return error when required fields are not provided', async () => {
    const equipment = {
      clientId,
      year: 2020,
      serialNumber: '1234567890',
      notes: 'Good condition',
    };

    const createRes = await request(app.getHttpServer())
      .post(`/clients/${clientId}/equipment`)
      .set('Authorization', `Bearer ${token}`)
      .send(equipment);

    expect(createRes.status).toBe(400);
  });

  it('should return equipment list for the client', async () => {
    const equipments = [
      {
        clientId,
        brand: 'Kamatsu',
        model: 'PC200',
        year: 2020,
        serialNumber: '1234567890',
        notes: 'Good condition',
      },
      {
        clientId,
        brand: 'Kamatsu',
        model: 'PC200',
        year: 2020,
        serialNumber: '1234567890',
        notes: 'Good condition',
      },
    ];

    for await (const equipment of equipments) {
      await request(app.getHttpServer())
        .post(`/clients/${clientId}/equipment`)
        .set('Authorization', `Bearer ${token}`)
        .send(equipment);
    }

    const getRes = await request(app.getHttpServer())
      .get(`/clients/${clientId}/equipment`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.body.data).toEqual(
      equipments.map((e) => expect.objectContaining(e)),
    );
  });

  it('should return 404 for non existing client', async () => {
    const getRes = await request(app.getHttpServer())
      .get(`/clients/999/equipment`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(404);
  });

  it('should return exact equipment', async () => {
    const equipment = {
      clientId,
      brand: 'Kamatsu',
      model: 'PC200',
      year: 2020,
      serialNumber: '1234567890',
      notes: 'Good condition',
    };

    const createRes = await request(app.getHttpServer())
      .post(`/clients/${clientId}/equipment`)
      .set('Authorization', `Bearer ${token}`)
      .send(equipment);

    const getRes = await request(app.getHttpServer())
      .get(`/clients/${clientId}/equipment/${createRes.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.body).toEqual(expect.objectContaining(equipment));
  });

  it('should return 404 for non existing equipment', async () => {
    const getRes = await request(app.getHttpServer())
      .get(`/clients/${clientId}/equipment/999`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(404);
  });

  it('should return deleted equipment', async () => {
    const equipment = {
      clientId,
      brand: 'Kamatsu',
      model: 'PC200',
      year: 2020,
      serialNumber: '1234567890',
      notes: 'Good condition',
    };

    const createRes = await request(app.getHttpServer())
      .post(`/clients/${clientId}/equipment`)
      .set('Authorization', `Bearer ${token}`)
      .send(equipment);

    const deleteRes = await request(app.getHttpServer())
      .delete(`/clients/${clientId}/equipment/${createRes.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    const getRes = await request(app.getHttpServer())
      .get(`/clients/${clientId}/equipment/${createRes.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(getRes.status).toBe(404);
  });
});
