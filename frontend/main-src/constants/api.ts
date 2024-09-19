const BASE_URL = 'http://localhost:3000';

const profileId = 'PX'

export const API_URLS = {
    ADMIN_CONFIG: `${BASE_URL}/admin/api/profile`,
    INGEST_DATA: `${BASE_URL}/api/ingest_data`,
    EXPLORE_DATA: `${BASE_URL}/api/expore_data_file`,
    CONFIGURATION: `${BASE_URL}/api/config_data`,
    CONVERSATION: `${BASE_URL}/api/conversation/azure_byod`,
    CUSTOM_CONVERSATION: `${BASE_URL}/api/conversation/custom`
};