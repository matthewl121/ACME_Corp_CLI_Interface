import { promises as fs } from 'fs';

export const writeFile = async (data: any, filename: string) => {
    const dataString = JSON.stringify(data, null, 2);
    await fs.writeFile(filename, dataString);
}

export const hasLicenseHeading = (readmeContent: string): boolean => {
    // Regex to match any level of "License" heading
    const licenseHeadingRegex = /#+\s*License\s*/i;
    const match = licenseHeadingRegex.exec(readmeContent);
    return match !== null;
};

