import {
  createContribution,
  getMyContributions,
  getCreatorPendingContributions,
  approveContribution,
  rejectContribution,
} from './contributions';

export const contributionService = {
  contribute: async (data) => {
    const res = await createContribution(data);
    return res?.data || res;
  },
  getMyContributions: async (params) => {
    const res = await getMyContributions(params);
    return res?.data || res;
  },
  getContributionsToReview: async (params) => {
    const res = await getCreatorPendingContributions(params);
    return res?.data || res;
  },
  approveContribution: async (id) => {
    const res = await approveContribution(id);
    return res?.data || res;
  },
  rejectContribution: async (id, reason) => {
    const res = await rejectContribution(id, reason);
    return res?.data || res;
  },
};

export default contributionService;
