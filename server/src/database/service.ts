import { Gender, Person } from '@prisma/client';
import { prisma } from './connector';

export async function registerPerson(data: Person) {
  try {
    return await prisma.person.create({ data });
  } catch (error) {
    console.log('Unable to register person: ', error);
  }
}

export async function getStats() {
  const totalPersons = await prisma.person.count();
  const totalMales = await prisma.person.count({ where: { gender: Gender.M } });
  const totalFemales = await prisma.person.count({
    where: { gender: Gender.F },
  });

  const persons = await prisma.person.findMany();
  return { persons, totalFemales, totalMales, totalPersons };
}
