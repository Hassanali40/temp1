import React, { useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { TextField, DefaultButton, Stack, Text } from '@fluentui/react';
import { getIngestDataApi, saveIngestDataApi } from '../../../api';
import { Dismiss16Regular, Edit16Regular } from '@fluentui/react-icons';
import styles from "./EditableTable.module.css";

const EditableTable = () => {
  const { control, register, handleSubmit } = useForm({
    defaultValues: {
      rows: [{ url: '', keywords: '' }],
    },
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: 'rows',
  });

  // Fetch initial data on component mount
  useEffect(() => {
    const loadData = async () => {
      const initialData = await getIngestDataApi();
      replace(initialData.length ? initialData : [{ url: '', keywords: '' }]);
    };
    loadData();
  }, [replace]);


  const onSubmit = async (data: any) => {
    await saveIngestDataApi(data);
  }

  const getEditableRow = (field: any, index: number) => {
    return (
      <tr key={index} >
        <td>
          <Stack>
            <input type="text"
              {...register(`rows.${index}.url`)}
              placeholder="Enter URL" className={styles.boxedInput} />
          </Stack>
        </td>
        <td>
          <Stack>
            <input type="text"
              {...register(`rows.${index}.keywords`)}
              placeholder="Enter Keywords" className={styles.boxedInput} />
          </Stack>
        </td>
        <td>
          <DefaultButton
            onClick={() => remove(index)}
          ><Dismiss16Regular />
          </DefaultButton>
        </td>
      </tr>
    )
  }


  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ flexGrow: 1 }}>
      <Stack>
        <table className={styles.fullWidthTable}>
          <thead>
            <tr>
              <th>URL</th>
              <th>Keywords</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {fields.map((field, index) => getEditableRow(field, index))}
          </tbody>
        </table>
      </Stack>
      <Stack horizontal gap={16}>
        <DefaultButton text="Add Row" onClick={() => append({ url: '', keywords: '' })} type="submit" />
        <DefaultButton primary text="Submit" type="submit" />
      </Stack>
    </form>
  );
};

export default EditableTable;
