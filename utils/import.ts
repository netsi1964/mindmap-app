// utils/import.ts

export function parseImportedJSON(jsonString: string): { topic: string; perspectives: any[] } | null {
  try {
    const data = JSON.parse(jsonString);
    if (!data.topic || !Array.isArray(data.perspectives)) {
      throw new Error('Invalid data structure');
    }
    data.perspectives.forEach((p: any) => {
      if (!p.titel || !p.beskrivelse || !p.kategori) {
        throw new Error('Invalid perspective data');
      }
    });
    return data;
  } catch (error) {
    console.error('Error parsing imported JSON:', error);
    return null;
  }
}

export function readImportedFile(file: File): Promise<{ topic: string; perspectives: any[] }> {
  return new Promise((resolve, reject) => {
    if (!file) {
      reject(new Error('No file selected'));
      return;
    }
    if (!file.name.endsWith('.json')) {
      reject(new Error('Only JSON files are supported'));
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = parseImportedJSON((event.target as any).result);
        if (data) {
          resolve(data);
        } else {
          reject(new Error('Invalid file format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    reader.readAsText(file);
  });
}

export function setupImportButton(
  button: HTMLElement,
  fileInput: HTMLInputElement,
  onImport: (data: { topic: string; perspectives: any[] }) => void
) {
  button.addEventListener('click', () => {
    fileInput.click();
  });
  fileInput.addEventListener('change', async (event: any) => {
    try {
      const file = event.target.files[0];
      const data = await readImportedFile(file);
      onImport(data);
      fileInput.value = '';
    } catch (error: any) {
      alert(`Import error: ${error.message}`);
      console.error('Import error:', error);
    }
  });
} 