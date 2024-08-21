import { Button, Stack, VerticalDivider } from "@fluentui/react";
import { Add12Regular, ChevronUp16Regular, CloudSync48Regular, Dismiss12Regular } from "@fluentui/react-icons";
import { useEffect, useState } from "react";
import { getIngestDataApi } from "../../api";
import styles from "./IngestData.module.css";
import EditableTable from "./EditableTable/EditableTable";

const IngestData = () => {

    return (
        <Stack verticalAlign="center" grow={1} style={{ paddingInline: "3rem" }} horizontalAlign="center">
            <Stack style={{ backgroundColor: "white", padding: "1rem", marginTop: "1rem", width: "720px" }}>
                <Stack horizontal horizontalAlign="space-between">
                    <span>Add urls to the knowledge base</span>
                    <span><ChevronUp16Regular /></span>
                </Stack>
                <Stack horizontal grow={1}>
                    <EditableTable />
                </Stack>
            </Stack>
        </Stack>
    )
}

export default IngestData;