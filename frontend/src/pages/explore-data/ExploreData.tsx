import { Stack } from "@fluentui/react";
import FileData from "./FileData/FileData.module";

const ExploreData = () => {

    return (
        <Stack verticalAlign="center" grow={1} style={{ paddingInline: "3rem" }} horizontalAlign="center">
            <Stack style={{ backgroundColor: "white", padding: "1rem", marginTop: "1rem", width: "720px" }}>
                <Stack >
                    <span>Explore Files Data</span>
                </Stack>
                <Stack horizontal grow={1}>
                    <FileData />
                </Stack>
            </Stack>
        </Stack>
    )
}

export default ExploreData;