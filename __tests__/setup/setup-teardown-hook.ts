import { afterAll, beforeAll } from 'vitest';
import { localStorageMock } from "./LocalStorageMock"
import { prisma } from "@/server/db";


//Setup Mock values In real database  
//Item by Item creation allows for retrieval of ids for post test cleanup
beforeAll(() => {
  global.localStorage = localStorageMock;
});

afterAll(async () => {
  delete global.localStorage;
});