import { useState, useEffect } from 'react';
import { dashboardRepository } from '../../shared/services/dashboardRepository';
import type { DashboardStats } from '../../shared/services/dashboardRepository';
import { activityRepository } from '../../shared/services/activityRepository';
import type { Activity } from '../../shared/types';

export const useDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    
    // Subscribe to dashboard summary
    const unsubscribeSummary = dashboardRepository.subscribeToSummary((summaryData) => {
      setStats(summaryData);
      setLoading(false);
    });

    // Subscribe to recent activities stream
    const unsubscribeActivities = activityRepository.subscribeRecent((recentActivities) => {
      setActivities(recentActivities);
    });

    return () => {
      unsubscribeSummary();
      unsubscribeActivities();
    };
  }, []);

  // Simulates a real-time Firestore change (e.g. background lead inflow or revenue updates)
  const simulateRealtimeActivity = async () => {
    if (!stats) return;
    
    // Pick a random action to update
    const triggers = ['lead', 'revenue', 'audit'];
    const selected = triggers[Math.floor(Math.random() * triggers.length)];

    if (selected === 'lead') {
      const increment = Math.floor(Math.random() * 5) + 1;
      await dashboardRepository.updateSummary({
        totalLeads: stats.totalLeads + increment,
        newLeads: stats.newLeads + increment,
      });
      await activityRepository.log({
        leadId: `lead-${Date.now()}`,
        type: 'status',
        title: 'New Lead Registered',
        description: `Automated campaign captured ${increment} new prospects.`,
        performedBy: 'System Engine',
      });
    } else if (selected === 'revenue') {
      const addedRevenue = (Math.floor(Math.random() * 4) + 1) * 250;
      await dashboardRepository.updateSummary({
        revenue: stats.revenue + addedRevenue,
        wonDeals: stats.wonDeals + 1,
      });
      await activityRepository.log({
        leadId: `lead-${Date.now()}`,
        type: 'proposal',
        title: 'Proposal Deal Closed',
        description: `Added $${addedRevenue} to active revenue.`,
        performedBy: 'Jordan (Sales)',
      });
    } else {
      await dashboardRepository.updateSummary({
        websiteAudits: stats.websiteAudits + 1,
        seoReports: stats.seoReports + 1,
      });
      await activityRepository.log({
        leadId: `lead-${Date.now()}`,
        type: 'seo',
        title: 'SEO Audit Executed',
        description: 'Completed automated crawl scan on website audit request.',
        performedBy: 'Audit Worker',
      });
    }
  };

  return {
    stats,
    activities,
    loading,
    simulateRealtimeActivity,
  };
};
export default useDashboard;
