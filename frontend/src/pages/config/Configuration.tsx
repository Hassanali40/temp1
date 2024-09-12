import { DefaultButton, Stack, VerticalDivider } from "@fluentui/react"
import { Dismiss12Regular } from "@fluentui/react-icons";
import styles from "./Configuration.module.css";
import { useFieldArray, useForm } from "react-hook-form";
import { useEffect, useRef, useState } from "react";
import { getConfigurationApi, saveConfigurationDataApi } from '../../api';
import Toast from "../../components/ToastComponent/Toast";


const Configuration = () => {
    const [status, setStatus] = useState<string>('')
    const [statusType, setStatusType] = useState<Number>()
    const toastRef = useRef<any>(null);

    const { control, register, handleSubmit } = useForm({
        defaultValues: {
            instruction: 'ER Staffing Anayst is designed to analyse',
            rows: [{ converstation: '' }],
        },
    });

    const { fields, append, remove, replace } = useFieldArray({
        control,
        name: 'rows',
    });

    useEffect(() => {
        const loadData = async () => {
            try {
                const initialData = await getConfigurationApi();
                replace(initialData.length ? initialData : [{ converstation: '' }]);
            }
            catch (error: any) {
                const parsedError = JSON.parse(error.message);
                setStatus(parsedError.message)
                setStatusType(1)
            }
        };
        loadData();
    }, [replace]);

    const onSubmit = async (data: any) => {
        try {
            await saveConfigurationDataApi(data);
        }
        catch (error: any) {
            const parsedError = JSON.parse(error.message);
            setStatus(parsedError.message)
            setStatusType(1)
            handleShowToast()
        }
    }

    const handleShowToast = () => {
        if (toastRef.current) {
            toastRef.current.showToast();
        }
    };

    return (
        <Stack grow={1} horizontalAlign="center" verticalAlign="center">
            <Stack style={{ width: "720px", backgroundColor: "white", padding: "1rem", borderRadius: "10px" }}>
                <header>
                    <span>Additional Information</span>
                </header>
                <form onSubmit={handleSubmit(onSubmit)} style={{ flexGrow: 1 }}>
                    <Stack>
                        <Stack style={{ marginTop: "1rem" }}>
                            <span>Instructions</span>
                            <textarea
                                {...register('instruction')}
                                rows={5} style={{ marginTop: "1rem", flexGrow: 1, background: "#f7f7f7", border: "none", outline: "none", padding: "1rem" }}>
                            </textarea>
                        </Stack>
                        <div style={{ marginTop: "1rem" }}>
                            <span>Conversation starters</span>
                            {fields.map((field, index) =>
                                <Stack horizontal style={{ marginTop: "1rem", backgroundColor: "#f7f7f7", borderRadius: "5px", border: "1px solid #e2e2e2" }}>
                                    <input type="text"
                                        {...register(`rows.${index}.converstation`)}
                                        style={{ padding: ".5rem", flexGrow: 1, background: "transparent", border: "none", outline: "none" }}
                                        placeholder="Enter conversation" className={styles.boxedInput} />
                                    <VerticalDivider />
                                    <div style={{ padding: ".5rem 1rem", borderLeft: "1px solid #e2e2e2" }}>
                                        <Dismiss12Regular onClick={() => remove(index)} />
                                    </div>
                                </Stack>
                            )}

                        </div>
                        <div style={{ marginTop: "1rem" }}>
                            <Stack horizontal gap={16}>
                                <DefaultButton text="Add Row" onClick={() => append({ converstation: '' })} />
                                <DefaultButton primary text="Submit" type="submit" />
                            </Stack>
                        </div>
                    </Stack>
                </form>
                <Stack>
                    <Toast status={status} type={statusType} ref={toastRef} />
                </Stack>
            </Stack>

        </Stack>
    )
}

export default Configuration;