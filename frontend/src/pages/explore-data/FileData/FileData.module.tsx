import { ComboBox, Dropdown, Stack } from "@fluentui/react";
import './FileData.module.css'
import { getExploreDataFileApi, getExploreDataFileDetailsApi, searchFiles } from '../../explore-data/MockData'
import { useEffect, useRef, useState } from "react";
import Toast from "../../../components/ToastComponent/Toast";
// import { mockFileData, mockFileDetailData } from '../../../api'

interface Props {
    onFileSelect: (event: any) => void;
    allFiles: any;
    onInputValueChange: (event: any) => void;
}

const FileData = () => {
    const [allFiles, SetAllFiles] = useState<any>([])
    const [fileDetail, setFileDetail] = useState<any>([])
    const [index, setIndex] = useState(0)
    const [status, setStatus] = useState<string>('')
    const [statusType, setStatusType] = useState<Number>()
    const toastRef = useRef<any>(null);

    const handleShowToast = () => {
        if (toastRef.current) {
            toastRef.current.showToast();
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const response: any = await getExploreDataFileApi();
                SetAllFiles(response);
                await getFilesDetails()
            } catch (error: any) {
                const parsedError = JSON.parse(error.message);
                setStatus(parsedError.message)
                setStatusType(1)
                handleShowToast()
            }
        };
        loadData();
    }, []);

    const getFilesDetails = async () => {
        try {
            const getDetails = await getExploreDataFileDetailsApi();
            setFileDetail(getDetails)
        }
        catch (error: any) {
            const parsedError = JSON.parse(error.message);
            setStatus(parsedError.message)
            setStatusType(1)
            handleShowToast()
        }
    }

    const onFileSelect = async ({ key }: any) => {
        setIndex(key)
        await getFilesDetails()
    }

    const onInputValueChange = async (value: string) => {
        const filterFile = await searchFiles(value)
        SetAllFiles(filterFile);
    }

    return (
        <Stack>
            <TableData onFileSelect={onFileSelect} allFiles={allFiles} onInputValueChange={onInputValueChange} />
            <Stack className="table-container">
                <span>Showing chunks for:</span>
                <table>
                    <thead>
                        <tr>
                            <th>Chunk</th>
                            <th>Content</th>
                            <th>Url</th>
                        </tr>
                    </thead>
                    <tbody>
                        {/* {mockFileDetailData.map(file =>
                            <tr>
                                <td>{file.chunkId}</td>
                                <td>{file.content}</td>
                                <td><a href="">{file.url}</a></td>
                            </tr>
                        )} */}
                        {fileDetail?.length > 0 &&
                            <tr>
                                <td>{fileDetail[index]?.chunkId}</td>
                                <td>{fileDetail[index]?.content}</td>
                                <td><a href="">{fileDetail[index]?.url}</a></td>
                            </tr>
                        }
                    </tbody>
                </table>
            </Stack>
            <Stack>
                <Toast status={status} type={statusType} ref={toastRef} />
            </Stack>
        </Stack>
    )
}




const TableData = ({ onFileSelect, allFiles, onInputValueChange }: Props) => {
    const fileOptions: any = allFiles.map((file: any) => ({
        key: file.id,
        text: file.name,
        url: file.url
    }));
    return (
        <Stack style={{ margin: "1rem 0" }} >
            <Stack className="dropdown-arrow">
                {/* <select onChange={(onFileSelect)} id="file-select">
                    {allFiles.length > 0 && allFiles.map((file: any) =>
                        <option key={file.id} value={file.id}>{file.name}</option>
                    )}
                </select> */}
                <ComboBox
                    placeholder="Select or search a file"
                    options={fileOptions}
                    onChange={(event, option) => onFileSelect(option)}
                    allowFreeform={true}
                    autoComplete="on"
                    onInputValueChange={onInputValueChange}
                />
            </Stack>
        </Stack>
    )

}

export default FileData;