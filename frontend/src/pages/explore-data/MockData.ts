
const mockFileDetailData = `[
    {
        "chunkId": 1,
        "content": "Commit to sit is a centering process that encourages caregivers to sit at eye level with patients to allow for undivided attention, and to help develop trusting and caring relationships.",
        "url": "http://chunk-url1"
    },
    {
        "chunkId": 2,
        "content": "Undivided attention, and to help develop trusting and caring relationships.",
        "url": "http://chunk-url1"
    },
    {
        "chunkId": 3,
        "content": "To help develop trusting and caring relationships.",
        "url": "http://chunk-url2"
    },
    {
        "chunkId": 4,
        "content": "Patients to allow for undivided attention. Commit to sit is a centering process that encourages caregivers to sit at eye level with patients to allow for undivided attention",
        "url": "http://chunk-url3"
    }
]`


const mockFileData = `
[
  {
    "id": 0,
    "name": "fist-case",
    "url": "http://file1.com/file"
  },
  {
    "id": 1,
    "name": "green",
    "url": "http://file1.com/file2"
  },
  {
    "id": 2,
    "name": "pic2",
    "url": "http://file2.com/file3"
  },
  {
    "id": 3,
    "name": "check",
    "url": "http://file3.com/file4"
  }
]`

const jsonBlob = new Blob([mockFileData], { type: 'application/json' });

const jsonUrlFile = URL.createObjectURL(jsonBlob);

const jsonBlob1 = new Blob([mockFileDetailData], { type: 'application/json' });


const jsonUrlFileDetail = URL.createObjectURL(jsonBlob1);

export const getExploreDataFileApi = async () => {
    try {
        const response = await fetch(jsonUrlFile);
        if (!response.ok) {
            throw new Error(JSON.stringify({
                message: response.statusText,
            }));
        }
        return response.json();
    } catch (error) {
        throw error;
    }
};

export const getExploreDataFileDetailsApi = async () => {
    try {
        const response = await fetch(jsonUrlFileDetail);
        if (!response.ok) {
            throw new Error(JSON.stringify({
                message: response.statusText,
            }));
        }
        return response.json();
    } catch (error) {
        throw error;
    }
};

export const searchFiles = async (value: string) => {
    try {
        const response = await fetch(jsonUrlFile);
        const data = await response.json();
        const filteredOptions = await data.filter((file: any) =>
            file.name.toLowerCase().includes(value.toLowerCase())
        );
        if (!response.ok) {
            throw new Error(`message: ${response.statusText}`);
        }
        return filteredOptions
    } catch (error) {
        throw error;
    }
};
