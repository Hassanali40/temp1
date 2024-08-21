import { Button, Stack, VerticalDivider } from "@fluentui/react"
import { Add12Regular, Dismiss12Regular } from "@fluentui/react-icons";
import styles from "./Configuration.module.css";

const Configuration = () => {
    return (
        <Stack grow={1} horizontalAlign="center" verticalAlign="end">
            <Stack style={{ width: "720px", backgroundColor: "white", padding: "1rem", borderRadius: "10px" }}>
                <header>
                    <span>Additional Information</span>
                </header>
                <Stack>
                    <Stack style={{ marginTop: "1rem" }}>
                        <span>Instructions</span>
                        <textarea rows={5} style={{ marginTop: "1rem", flexGrow: 1, background: "#f7f7f7", border: "none", outline: "none", padding: "1rem" }}>
                            ER Staffing Anayst is designed to analyse
                        </textarea>
                    </Stack>
                    <div style={{ marginTop: "1rem" }}>
                        <span>Conversation starters</span>
                        <Stack horizontal style={{ marginTop: "1rem", backgroundColor: "#f7f7f7", borderRadius: "5px", border: "1px solid #e2e2e2" }}>
                            <input type="text" value="Analyse hourly" style={{ padding: ".5rem", flexGrow: 1, background: "transparent", border: "none", outline: "none" }} />
                            <VerticalDivider />
                            <div style={{ padding: ".5rem 1rem", borderLeft: "1px solid #e2e2e2" }}>
                                <Dismiss12Regular />
                            </div>
                        </Stack>
                        <Stack horizontal style={{ marginTop: ".5rem", backgroundColor: "#f7f7f7", borderRadius: "5px", border: "1px solid #e2e2e2" }}>
                            <input type="text" value="What are the" style={{ padding: ".5rem", flexGrow: 1, background: "transparent", border: "none", outline: "none" }} />
                            <VerticalDivider />
                            <div style={{ padding: ".5rem 1rem", borderLeft: "1px solid #e2e2e2" }}>
                                <Dismiss12Regular />
                            </div>
                        </Stack>
                        <Stack horizontal style={{ marginTop: ".5rem", backgroundColor: "#f7f7f7", borderRadius: "5px", border: "1px solid #e2e2e2" }}>
                            <input type="text" value="Suggest staffing" style={{ padding: ".5rem", flexGrow: 1, background: "transparent", border: "none", outline: "none" }} />
                            <VerticalDivider />
                            <div style={{ padding: ".5rem 1rem", borderLeft: "1px solid #e2e2e2" }}>
                                <Dismiss12Regular />
                            </div>
                        </Stack>
                        <Stack horizontal style={{ marginTop: ".5rem", backgroundColor: "#f7f7f7", borderRadius: "5px", border: "1px solid #e2e2e2" }}>
                            <input type="text" value="Identify trends" style={{ padding: ".5rem", flexGrow: 1, background: "transparent", border: "none", outline: "none" }} />
                            <VerticalDivider />
                            <div style={{ padding: ".5rem 1rem", borderLeft: "1px solid #e2e2e2" }}>
                                <Dismiss12Regular />
                            </div>
                        </Stack>
                        <Stack horizontal style={{ marginTop: ".5rem", backgroundColor: "#f7f7f7", borderRadius: "5px", border: "1px solid #e2e2e2" }}>
                            <input type="text" placeholder="Add More..." style={{ padding: ".5rem", flexGrow: 1, background: "transparent", border: "none", outline: "none" }} />
                            <VerticalDivider />
                            <div style={{ padding: ".5rem 1rem", borderLeft: "1px solid #e2e2e2" }}>
                                <Add12Regular />
                            </div>
                        </Stack>
                    </div>
                    <div style={{ marginTop: "1rem" }}>
                        <Button primary>Save</Button>
                    </div>
                </Stack>
            </Stack>
        </Stack>
    )
}

export default Configuration;