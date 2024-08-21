import { useRef, useState, useEffect } from "react";
import { Stack } from "@fluentui/react";
import {
    BroomRegular,
    DismissRegular,
    SquareRegular,
    AttachTextRegular,
} from "@fluentui/react-icons";
import { useForm, SubmitHandler } from "react-hook-form"
import React from "react";

import styles from "./AdvisorProfile.module.css";

type Inputs = {
    advisor_instructions: string
    conversation_starters: string[]
    knowledge_upload_files: string
}

type AdvisorResponse = Inputs

const saveAdminConfigApiRequest = async (data: {}) => {
    try {
        const response = await Promise.resolve({ status: 200 });
        if (response.status != 200) {
            alert(
                "An error occurred. Please try again. If the problem persists, please contact the site administrator."
            );
        }

    } catch (e) {
        alert(
            "An error occurred. Please try again. If the problem persists, please contact the site administrator."
        );
    }
};


const AdvisorProfile = () => {

    const {
        register,
        handleSubmit,
        formState: { errors, isLoading },
    } = useForm<AdvisorResponse>({
        defaultValues: {}
    });

    const onSubmit: SubmitHandler<Inputs> = (data) => saveAdminConfigApiRequest(data)

    return (
        <div className={styles.container}>
            <Stack className={styles.adminRoot}>
                <div className={`${styles.adminContainer} ${styles.MobileAdminContainer}`}>
                    <h3>Additional Instructions</h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Stack className={styles.textAreaInputContainer}>
                            <label className={styles.textAreaLabel} htmlFor="advisor_instructions">Instructions</label>
                            <textarea id="advisor_instructions" defaultValue=""
                                aria-multiline
                                className={styles.configurationInputTextArea}
                                {...register("advisor_instructions", { required: true })}
                            />
                            {errors.advisor_instructions && <span className={styles.spanError}>This field is required</span>}
                        </Stack>
                        <h5>Conversation Starters</h5>
                        <Stack className={styles.textAreaInputContainer}>
                            <label className={styles.textAreaLabel} htmlFor="conversation_starters">Text processing tool system prompt</label>
                            <textarea id="conversation_starters"
                                aria-multiline
                                className={styles.configurationInputTextArea}
                                {...register("conversation_starters", { required: true })}
                            />
                            {errors.conversation_starters && <span className={styles.spanError}>This field is required</span>}
                        </Stack>
                        <input type="submit" />
                    </form>
                </div>
            </Stack>
        </div>
    );
};

export default AdvisorProfile;
