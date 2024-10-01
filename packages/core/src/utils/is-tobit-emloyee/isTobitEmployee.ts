import { UacServiceClient } from '@chayns/uac-service';
import { getAccessToken, getLanguage, getSite, getUser } from 'chayns-api';

const client = new UacServiceClient({
    getToken: async () => (await getAccessToken()).accessToken || '',
    getDefaultSiteId: () => getSite().id,
    getDefaultPersonId: () => getUser()?.personId || '',
    getLanguage: () => getLanguage().active,
});

export const getIsTobitEmployee = async () => {
    const siteInfos = await client.getMembershipSites({ groupId: 8255 });

    let isEmployee = false;

    siteInfos.forEach(({ siteId }) => {
        isEmployee = siteId === '60038-22141';
    });

    return isEmployee;
};
