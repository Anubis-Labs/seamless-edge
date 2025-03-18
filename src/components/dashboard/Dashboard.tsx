import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  Grid,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  Stack,
  Typography,
  Avatar,
  LinearProgress,
  Tooltip,
  useTheme,
} from '@mui/material';
import {
  AttachMoney as MoneyIcon,
  Assignment as ProjectIcon,
  Person as ClientIcon,
  Star as StarIcon,
  DateRange as DateIcon,
  Refresh as RefreshIcon,
  Visibility as ViewIcon,
  Phone as PhoneIcon,
  Email as EmailIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import moment from 'moment';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend,
  Filler
);

interface DashboardStats {
  totalRevenue: number;
  monthlyRevenue: number;
  completedProjects: number;
  activeProjects: number;
  totalClients: number;
  newClientsThisMonth: number;
  pendingBookings: number;
  averageRating: number;
}

interface RecentActivity {
  id: number;
  type: 'project' | 'client' | 'booking' | 'testimonial';
  title: string;
  date: string;
  status?: string;
  description?: string;
  entity_id: number;
}

interface ProjectStatus {
  status: string;
  count: number;
}

interface MonthlyRevenue {
  month: string;
  revenue: number;
}

interface ServiceDistribution {
  service: string;
  count: number;
}

export default function Dashboard() {
  const theme = useTheme();
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    monthlyRevenue: 0,
    completedProjects: 0,
    activeProjects: 0,
    totalClients: 0,
    newClientsThisMonth: 0,
    pendingBookings: 0,
    averageRating: 0,
  });
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [projectStatus, setProjectStatus] = useState<ProjectStatus[]>([]);
  const [monthlyRevenue, setMonthlyRevenue] = useState<MonthlyRevenue[]>([]);
  const [serviceDistribution, setServiceDistribution] = useState<ServiceDistribution[]>([]);
  const [upcomingBookings, setUpcomingBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await Promise.all([
        fetchStats(),
        fetchRecentActivity(),
        fetchProjectStatusData(),
        fetchMonthlyRevenueData(),
        fetchServiceDistributionData(),
        fetchUpcomingBookings(),
      ]);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error.message);
      setError('Failed to load dashboard data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    // Get first day of current month
    const firstDayOfMonth = moment().startOf('month').toISOString();

    // Fetch total revenue
    const { data: revenueData } = await supabase
      .from('projects')
      .select('total_cost')
      .not('total_cost', 'is', null);

    const totalRevenue = revenueData?.reduce((sum, project) => sum + (project.total_cost || 0), 0) || 0;

    // Fetch monthly revenue
    const { data: monthlyRevenueData } = await supabase
      .from('projects')
      .select('total_cost')
      .not('total_cost', 'is', null)
      .gte('created_at', firstDayOfMonth);

    const monthlyRevenue = monthlyRevenueData?.reduce((sum, project) => sum + (project.total_cost || 0), 0) || 0;

    // Fetch project counts
    const { data: completedProjects } = await supabase
      .from('projects')
      .select('id', { count: 'exact' })
      .eq('status', 'completed');

    const { data: activeProjects } = await supabase
      .from('projects')
      .select('id', { count: 'exact' })
      .eq('status', 'in_progress');

    // Fetch client counts
    const { data: totalClients } = await supabase
      .from('clients')
      .select('id', { count: 'exact' });

    const { data: newClientsThisMonth } = await supabase
      .from('clients')
      .select('id', { count: 'exact' })
      .gte('created_at', firstDayOfMonth);

    // Fetch booking counts
    const { data: pendingBookings } = await supabase
      .from('bookings')
      .select('id', { count: 'exact' })
      .eq('status', 'pending');

    // Fetch average rating
    const { data: testimonialData } = await supabase
      .from('testimonials')
      .select('rating')
      .eq('status', 'approved');

    const totalRating = testimonialData?.reduce((sum, testimonial) => sum + testimonial.rating, 0) || 0;
    const averageRating = testimonialData?.length ? totalRating / testimonialData.length : 0;

    setStats({
      totalRevenue,
      monthlyRevenue,
      completedProjects: completedProjects?.length || 0,
      activeProjects: activeProjects?.length || 0,
      totalClients: totalClients?.length || 0,
      newClientsThisMonth: newClientsThisMonth?.length || 0,
      pendingBookings: pendingBookings?.length || 0,
      averageRating,
    });
  };

  const fetchRecentActivity = async () => {
    const recentActivities: RecentActivity[] = [];

    // Get recent projects
    const { data: recentProjects } = await supabase
      .from('projects')
      .select('id, title, created_at, status')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentProjects) {
      recentProjects.forEach((project) => {
        recentActivities.push({
          id: recentActivities.length + 1,
          type: 'project',
          title: project.title,
          date: project.created_at,
          status: project.status,
          description: `Project ${project.status === 'completed' ? 'completed' : 'created/updated'}`,
          entity_id: project.id,
        });
      });
    }

    // Get recent clients
    const { data: recentClients } = await supabase
      .from('clients')
      .select('id, first_name, last_name, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentClients) {
      recentClients.forEach((client) => {
        recentActivities.push({
          id: recentActivities.length + 1,
          type: 'client',
          title: `${client.first_name} ${client.last_name}`,
          date: client.created_at,
          description: 'New client added',
          entity_id: client.id,
        });
      });
    }

    // Get recent bookings
    const { data: recentBookings } = await supabase
      .from('bookings')
      .select('id, client_name, service_type, created_at, status')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentBookings) {
      recentBookings.forEach((booking) => {
        recentActivities.push({
          id: recentActivities.length + 1,
          type: 'booking',
          title: `${booking.client_name} - ${booking.service_type}`,
          date: booking.created_at,
          status: booking.status,
          description: `Booking ${booking.status}`,
          entity_id: booking.id,
        });
      });
    }

    // Get recent testimonials
    const { data: recentTestimonials } = await supabase
      .from('testimonials')
      .select('id, client_name, created_at, status')
      .order('created_at', { ascending: false })
      .limit(5);

    if (recentTestimonials) {
      recentTestimonials.forEach((testimonial) => {
        recentActivities.push({
          id: recentActivities.length + 1,
          type: 'testimonial',
          title: testimonial.client_name,
          date: testimonial.created_at,
          status: testimonial.status,
          description: `Testimonial ${testimonial.status}`,
          entity_id: testimonial.id,
        });
      });
    }

    // Sort by date (newest first) and limit to 10
    recentActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    setRecentActivity(recentActivities.slice(0, 10));
  };

  const fetchProjectStatusData = async () => {
    const { data, error } = await supabase.rpc('get_project_status_counts');

    if (error) throw error;

    if (data) {
      setProjectStatus(data);
    }
  };

  const fetchMonthlyRevenueData = async () => {
    const { data, error } = await supabase.rpc('get_monthly_revenue');

    if (error) throw error;

    if (data) {
      setMonthlyRevenue(data);
    }
  };

  const fetchServiceDistributionData = async () => {
    const { data, error } = await supabase.rpc('get_service_distribution');

    if (error) throw error;

    if (data) {
      setServiceDistribution(data);
    }
  };

  const fetchUpcomingBookings = async () => {
    const today = new Date().toISOString();
    
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .gte('start_time', today)
      .order('start_time', { ascending: true })
      .limit(5);

    if (error) throw error;

    if (data) {
      setUpcomingBookings(data);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return moment(dateString).format('MMM D, YYYY');
  };

  const formatDateTime = (dateString: string) => {
    return moment(dateString).format('MMM D, YYYY h:mm A');
  };

  const formatTimeAgo = (dateString: string) => {
    return moment(dateString).fromNow();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'project':
        return <ProjectIcon />;
      case 'client':
        return <ClientIcon />;
      case 'booking':
        return <DateIcon />;
      case 'testimonial':
        return <StarIcon />;
      default:
        return <ProjectIcon />;
    }
  };

  const getStatusPercent = (completed: number, active: number) => {
    const total = completed + active;
    return total > 0 ? (completed / total) * 100 : 0;
  };

  // Prepare chart data
  const projectStatusChartData = {
    labels: projectStatus.map(item => item.status),
    datasets: [
      {
        data: projectStatus.map(item => item.count),
        backgroundColor: [
          theme.palette.success.main,
          theme.palette.info.main,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
        borderWidth: 1,
      },
    ],
  };

  const monthlyRevenueChartData = {
    labels: monthlyRevenue.map(item => item.month),
    datasets: [
      {
        label: 'Monthly Revenue',
        data: monthlyRevenue.map(item => item.revenue),
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.light + '80', // Add transparency
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const serviceDistributionChartData = {
    labels: serviceDistribution.map(item => item.service),
    datasets: [
      {
        label: 'Projects by Service',
        data: serviceDistribution.map(item => item.count),
        backgroundColor: [
          theme.palette.primary.main,
          theme.palette.secondary.main,
          theme.palette.info.main,
          theme.palette.success.main,
          theme.palette.warning.main,
          theme.palette.error.main,
        ],
      },
    ],
  };

  return (
    <Box>
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Dashboard
        </Typography>
        <Button
          startIcon={<RefreshIcon />}
          onClick={fetchDashboardData}
          disabled={isLoading}
        >
          Refresh
        </Button>
      </Box>

      {/* Key Metrics */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
                  <MoneyIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Total Revenue
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                {formatCurrency(stats.totalRevenue)}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatCurrency(stats.monthlyRevenue)} this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: 'success.main', mr: 2 }}>
                  <ProjectIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Projects
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                {stats.completedProjects + stats.activeProjects}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LinearProgress 
                  variant="determinate" 
                  value={getStatusPercent(stats.completedProjects, stats.activeProjects)} 
                  sx={{ flexGrow: 1, mr: 1 }}
                />
                <Typography variant="body2" color="text.secondary">
                  {Math.round(getStatusPercent(stats.completedProjects, stats.activeProjects))}%
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary">
                {stats.activeProjects} active, {stats.completedProjects} completed
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: 'info.main', mr: 2 }}>
                  <ClientIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Clients
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                {stats.totalClients}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {stats.newClientsThisMonth} new this month
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Avatar sx={{ bgcolor: 'warning.main', mr: 2 }}>
                  <DateIcon />
                </Avatar>
                <Typography variant="h6" component="div">
                  Pending Bookings
                </Typography>
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                {stats.pendingBookings}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Require approval
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Charts and Activity */}
      <Grid container spacing={3}>
        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Monthly Revenue" />
                <Divider />
                <CardContent>
                  <Box sx={{ height: 300 }}>
                    {monthlyRevenue.length > 0 ? (
                      <Line 
                        data={monthlyRevenueChartData} 
                        options={{ 
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                              ticks: {
                                callback: (value: any) => formatCurrency(value),
                              },
                            },
                          },
                        }}
                      />
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography variant="body1" color="text.secondary">
                          No revenue data available
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardHeader title="Project Status" />
                <Divider />
                <CardContent>
                  <Box sx={{ height: 250, display: 'flex', justifyContent: 'center' }}>
                    {projectStatus.length > 0 ? (
                      <Doughnut 
                        data={projectStatusChartData} 
                        options={{ 
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              position: 'bottom',
                            },
                          },
                        }}
                      />
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography variant="body1" color="text.secondary">
                          No project data available
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Card>
                <CardHeader title="Service Distribution" />
                <Divider />
                <CardContent>
                  <Box sx={{ height: 250 }}>
                    {serviceDistribution.length > 0 ? (
                      <Bar 
                        data={serviceDistributionChartData} 
                        options={{ 
                          responsive: true,
                          maintainAspectRatio: false,
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                          scales: {
                            y: {
                              beginAtZero: true,
                            },
                          },
                        }}
                      />
                    ) : (
                      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                        <Typography variant="body1" color="text.secondary">
                          No service data available
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>

        {/* Activity and Bookings */}
        <Grid item xs={12} md={4}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card>
                <CardHeader 
                  title="Recent Activity" 
                  action={
                    <Chip 
                      label={`${stats.averageRating.toFixed(1)}/5`}
                      icon={<StarIcon fontSize="small" />}
                      color="primary"
                    />
                  }
                />
                <Divider />
                <List sx={{ maxHeight: 400, overflow: 'auto' }}>
                  {recentActivity.map((activity) => (
                    <React.Fragment key={activity.id}>
                      <ListItem
                        secondaryAction={
                          <IconButton edge="end" size="small">
                            <ViewIcon fontSize="small" />
                          </IconButton>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: getStatusColor(activity.status || '') + '.main' }}>
                            {getActivityIcon(activity.type)}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={activity.title}
                          secondary={
                            <React.Fragment>
                              <Typography variant="body2" component="span">
                                {activity.description}
                              </Typography>
                              <br />
                              <Typography variant="caption" color="text.secondary">
                                {formatTimeAgo(activity.date)}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                  {recentActivity.length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary="No recent activity"
                        secondary="Activities will appear here as they occur"
                      />
                    </ListItem>
                  )}
                </List>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardHeader title="Upcoming Bookings" />
                <Divider />
                <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                  {upcomingBookings.map((booking) => (
                    <React.Fragment key={booking.id}>
                      <ListItem
                        secondaryAction={
                          <Stack direction="row" spacing={1}>
                            <Tooltip title="Email">
                              <IconButton edge="end" size="small" href={`mailto:${booking.client_email}`}>
                                <EmailIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Call">
                              <IconButton edge="end" size="small" href={`tel:${booking.client_phone}`}>
                                <PhoneIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Mark as Confirmed">
                              <IconButton edge="end" size="small" color="success">
                                <CheckIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </Stack>
                        }
                      >
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: getStatusColor(booking.status) + '.main' }}>
                            <DateIcon />
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={booking.client_name}
                          secondary={
                            <React.Fragment>
                              <Typography variant="body2" component="span">
                                {booking.service_type}
                              </Typography>
                              <br />
                              <Typography variant="caption" color="text.secondary">
                                {formatDateTime(booking.start_time)}
                              </Typography>
                            </React.Fragment>
                          }
                        />
                      </ListItem>
                      <Divider variant="inset" component="li" />
                    </React.Fragment>
                  ))}
                  {upcomingBookings.length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary="No upcoming bookings"
                        secondary="Future bookings will appear here"
                      />
                    </ListItem>
                  )}
                </List>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
} 