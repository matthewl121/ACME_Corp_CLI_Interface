import { promises as fs } from 'fs';

export const writeFile = async (data: any, filename: string) => {
    const dataString = JSON.stringify(data, null, 2);
    await fs.writeFile(filename, dataString);
}

