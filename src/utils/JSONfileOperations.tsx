import fs from "fs/promises";
import path from "path";

const dataDirectory = path.join(process.cwd(), "data");

export const ensureDataDirectory = async (): Promise<void> => {
  try {
    await fs.mkdir(dataDirectory, { recursive: true });
  } catch (error) {
    console.error("Error creating data directory:", error);
    throw error;
  }
};

export async function readJsonFile<T>(fileName: string): Promise<T> {
  try {
    const filePath = path.join(dataDirectory, fileName);
    const fileContent = await fs.readFile(filePath, "utf-8");
    return JSON.parse(fileContent) as T;
  } catch (error: unknown) {
    if (error instanceof Error && "code" in error && error.code === "ENOENT") {
      return {} as T;
    }
    throw error;
  }
}

export async function writeJsonFile<T>(
  fileName: string,
  data: T
): Promise<void> {
  try {
    await ensureDataDirectory();
    const filePath = path.join(dataDirectory, fileName);
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (error) {
    console.error(`Error writing to ${fileName}:`, error);
    throw error;
  }
}
