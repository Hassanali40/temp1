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
import {
  getAdminConfigApi,
  saveAdminConfigApi
} from "./../../api";

import { AdminConfigResponse } from "./../../api/models";

import styles from "./Admin.module.css";

type Inputs = {
  user_intent_sys_prompt: string
  text_processing_tool_sys_prompt: string
  answering_user_prompt: string
  answering_sys_prompt: string
}

const saveAdminConfigApiRequest = async (data: AdminConfigResponse) => {
  try {
    const response = await saveAdminConfigApi(data)
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

const Admin = () => {

  const {
    register,
    handleSubmit,
    formState: { errors, isLoading },
  } = useForm<AdminConfigResponse>({
    defaultValues: async () => await getAdminConfigApi()
  });

  const onSubmit: SubmitHandler<Inputs> = (data) => saveAdminConfigApiRequest(data)

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className={styles.container}>
      <Stack className={styles.adminRoot}>
        <div className={`${styles.adminContainer} ${styles.MobileAdminContainer}`}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack className={styles.textAreaInputContainer}>
              <label className={styles.textAreaLabel} htmlFor="user_intent_sys_prompt">User intent system prompt</label>
              <textarea id="user_intent_sys_prompt" defaultValue=""
                aria-multiline
                className={styles.configurationInputTextArea}
                {...register("user_intent_sys_prompt", { required: true })}
              />
              {errors.user_intent_sys_prompt && <span className={styles.spanError}>This field is required</span>}
            </Stack>
            <Stack className={styles.textAreaInputContainer}>
              <label className={styles.textAreaLabel} htmlFor="text_processing_tool_sys_prompt">Text processing tool system prompt</label>
              <textarea id="text_processing_tool_sys_prompt"
                aria-multiline
                className={styles.configurationInputTextArea}
                {...register("text_processing_tool_sys_prompt", { required: true })}
              />
              {errors.text_processing_tool_sys_prompt && <span className={styles.spanError}>This field is required</span>}
            </Stack>
            <Stack className={styles.textAreaInputContainer}>
              <label className={styles.textAreaLabel} htmlFor="answering_user_prompt">Answering user prompt</label>
              <textarea id="answering_user_prompt"
                aria-multiline
                className={styles.configurationInputTextArea}
                {...register("answering_user_prompt", { required: true })}
              />
              {errors.answering_user_prompt && <span className={styles.spanError}>This field is required</span>}
            </Stack>
            <Stack className={styles.textAreaInputContainer}>
              <label className={styles.textAreaLabel} htmlFor="answering_sys_prompt">Answering system prompt</label>
              <textarea id="answering_sys_prompt"
                aria-multiline
                className={styles.configurationInputTextArea}
                {...register("answering_sys_prompt", { required: true })}
              />
              {errors.answering_sys_prompt && <span className={styles.spanError}>This field is required</span>}
            </Stack>
            <input type="submit" />
          </form>
        </div>
      </Stack>
    </div>
  );
};

export default Admin;
