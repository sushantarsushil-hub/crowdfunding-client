import {
  getCampaigns,
  getCampaignById,
  createCampaign,
  updateCampaign,
  deleteCampaign,
  getMyCampaigns,
  approveCampaign,
  rejectCampaign,
} from './campaigns';
import { submitReport } from './reports';

export const campaignService = {
  getCampaigns: async (params) => {
    const res = await getCampaigns(params);
    return res?.data || res;
  },
  getCampaignById: async (id) => {
    const res = await getCampaignById(id);
    return res?.data || res;
  },
  createCampaign: async (data) => {
    const res = await createCampaign(data);
    return res?.data || res;
  },
  updateCampaign: async (id, data) => {
    const res = await updateCampaign(id, data);
    return res?.data || res;
  },
  deleteCampaign: async (id) => {
    const res = await deleteCampaign(id);
    return res?.data || res;
  },
  getMyCampaigns: async (params) => {
    const res = await getMyCampaigns(params);
    return res?.data || res;
  },
  approveCampaign: async (id) => {
    const res = await approveCampaign(id);
    return res?.data || res;
  },
  rejectCampaign: async (id, reason) => {
    const res = await rejectCampaign(id, reason);
    return res?.data || res;
  },
  reportCampaign: async (id, reportData) => {
    const res = await submitReport({ campaignId: id, reason: reportData?.reason || reportData });
    return res?.data || res;
  },
};

export default campaignService;
