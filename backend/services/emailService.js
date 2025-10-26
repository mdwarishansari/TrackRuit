import { sendEmail, sendOTPEmail, sendPasswordResetEmail } from '../config/mailer.js';
import { logger } from '../utils/logger.js';

class EmailService {
  constructor() {
    this.templates = {
      WELCOME: 'welcome',
      JOB_ALERT: 'job_alert',
      APPLICATION_UPDATE: 'application_update',
      WEEKLY_SUMMARY: 'weekly_summary',
      SECURITY_ALERT: 'security_alert'
    };
  }

  async sendWelcomeEmail(user) {
    try {
      const subject = 'Welcome to TrackRuit - Start Tracking Your Job Applications';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Welcome to TrackRuit, ${user.name}! 🎉</h2>
          <p>We're excited to have you on board. TrackRuit will help you:</p>
          <ul>
            <li>📊 Track all your job applications in one place</li>
            <li>🤖 Get AI-powered resume analysis and job matching</li>
            <li>📈 Analyze your application success rates</li>
            <li>🔔 Never miss deadlines or follow-ups</li>
          </ul>
          <p>Get started by:</p>
          <ol>
            <li>Uploading your resume for AI analysis</li>
            <li>Adding your first job application</li>
            <li>Installing our browser extension for automatic tracking</li>
          </ol>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/dashboard" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Go to Dashboard
            </a>
          </div>
          <p>If you have any questions, feel free to reply to this email.</p>
          <br>
          <p>Best regards,<br>The TrackRuit Team</p>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject,
        html
      });

      logger.info(`Welcome email sent to ${user.email}`);
      return true;
    } catch (error) {
      logger.error('Welcome email error:', error);
      return false;
    }
  }

  async sendJobAlertEmail(user, jobs) {
    try {
      const subject = `🎯 ${jobs.length} New Job Recommendations for You`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Job Recommendations Based on Your Profile</h2>
          <p>Hello ${user.name},</p>
          <p>We found ${jobs.length} jobs that match your skills and preferences:</p>
          
          ${jobs.slice(0, 5).map(job => `
            <div style="border: 1px solid #e5e7eb; padding: 15px; margin: 10px 0; border-radius: 6px;">
              <h3 style="margin: 0 0 5px 0;">${job.title}</h3>
              <p style="margin: 0 0 5px 0; color: #6b7280;">${job.company} • ${job.location}</p>
              <p style="margin: 0 0 10px 0; font-size: 14px;">${job.description?.substring(0, 150)}...</p>
              <a href="${job.url || '#'}" style="color: #2563eb; text-decoration: none; font-size: 14px;">
                View Job Details →
              </a>
            </div>
          `).join('')}
          
          ${jobs.length > 5 ? `
            <p style="text-align: center; margin: 20px 0;">
              <em>... and ${jobs.length - 5} more jobs</em>
            </p>
          ` : ''}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/jobs/recommendations" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View All Recommendations
            </a>
          </div>
          <p>Happy job hunting! 🚀</p>
          <br>
          <p>Best regards,<br>The TrackRuit Team</p>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject,
        html
      });

      logger.info(`Job alert email sent to ${user.email}`);
      return true;
    } catch (error) {
      logger.error('Job alert email error:', error);
      return false;
    }
  }

  async sendApplicationUpdateEmail(user, job, oldStatus, newStatus) {
    try {
      const statusEmoji = {
        'applied': '📄',
        'under_review': '👀',
        'interview': '🎯',
        'rejected': '❌',
        'accepted': '✅',
        'offered': '💰',
        'withdrawn': '↩️'
      };

      const subject = `Application Update: ${job.title} at ${job.company}`;
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Application Status Update</h2>
          <p>Hello ${user.name},</p>
          <p>Your application status has been updated:</p>
          
          <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 10px 0;">${job.title}</h3>
            <p style="margin: 0 0 5px 0; color: #6b7280;">${job.company} • ${job.location}</p>
            <div style="display: flex; align-items: center; margin: 15px 0;">
              <span style="text-decoration: line-through; color: #9ca3af; margin-right: 10px;">
                ${oldStatus} ${statusEmoji[oldStatus]}
              </span>
              <span style="font-weight: bold; color: #2563eb;">
                → ${newStatus} ${statusEmoji[newStatus]}
              </span>
            </div>
            <p style="margin: 10px 0 0 0; font-size: 14px;">
              Applied: ${new Date(job.appliedAt).toLocaleDateString()}
            </p>
          </div>

          ${this.getStatusSpecificContent(newStatus)}
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/jobs/${job._id}" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Application Details
            </a>
          </div>
          
          <p>Keep up the great work! 💪</p>
          <br>
          <p>Best regards,<br>The TrackRuit Team</p>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject,
        html
      });

      logger.info(`Application update email sent to ${user.email}`);
      return true;
    } catch (error) {
      logger.error('Application update email error:', error);
      return false;
    }
  }

  async sendWeeklySummaryEmail(user, summary) {
    try {
      const subject = '📊 Your Weekly Job Search Summary';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Weekly Job Search Summary</h2>
          <p>Hello ${user.name},</p>
          <p>Here's your weekly job search activity summary:</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin: 20px 0;">
            <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #2563eb;">${summary.applicationsThisWeek}</div>
              <div style="font-size: 14px; color: #6b7280;">Applications This Week</div>
            </div>
            <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #16a34a;">${summary.interviewsThisWeek}</div>
              <div style="font-size: 14px; color: #6b7280;">Interviews This Week</div>
            </div>
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #d97706;">${summary.successRate}%</div>
              <div style="font-size: 14px; color: #6b7280;">Success Rate</div>
            </div>
            <div style="background-color: #f3e8ff; padding: 15px; border-radius: 8px; text-align: center;">
              <div style="font-size: 24px; font-weight: bold; color: #9333ea;">${summary.activeApplications}</div>
              <div style="font-size: 14px; color: #6b7280;">Active Applications</div>
            </div>
          </div>

          ${summary.upcomingInterviews.length > 0 ? `
            <div style="margin: 25px 0;">
              <h3 style="color: #2563eb; margin-bottom: 15px;">📅 Upcoming Interviews</h3>
              ${summary.upcomingInterviews.map(interview => `
                <div style="border-left: 4px solid #2563eb; padding: 10px 15px; margin: 10px 0; background-color: #f8fafc;">
                  <strong>${interview.title} at ${interview.company}</strong><br>
                  <span style="color: #6b7280; font-size: 14px;">
                    ${new Date(interview.interviewDate).toLocaleDateString()} at ${new Date(interview.interviewDate).toLocaleTimeString()}
                  </span>
                </div>
              `).join('')}
            </div>
          ` : ''}

          <div style="background-color: #fefce8; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #854d0e;">💡 Tip of the Week</h4>
            <p style="margin: 0; font-size: 14px;">
              ${this.getWeeklyTip(summary.applicationsThisWeek)}
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/analytics" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              View Detailed Analytics
            </a>
          </div>
          
          <p>Keep pushing forward! Your next opportunity is just around the corner. 🌟</p>
          <br>
          <p>Best regards,<br>The TrackRuit Team</p>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject,
        html
      });

      logger.info(`Weekly summary email sent to ${user.email}`);
      return true;
    } catch (error) {
      logger.error('Weekly summary email error:', error);
      return false;
    }
  }

  async sendSecurityAlertEmail(user, action, deviceInfo = {}) {
    try {
      const subject = '🔒 Security Alert: Important Account Activity';
      const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #dc2626;">Security Alert</h2>
          <p>Hello ${user.name},</p>
          <p>We noticed important activity on your TrackRuit account:</p>
          
          <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #dc2626;">Action: ${action}</h4>
            <p style="margin: 5px 0; font-size: 14px;">
              <strong>Time:</strong> ${new Date().toLocaleString()}
            </p>
            ${deviceInfo.ip ? `<p style="margin: 5px 0; font-size: 14px;"><strong>IP Address:</strong> ${deviceInfo.ip}</p>` : ''}
            ${deviceInfo.browser ? `<p style="margin: 5px 0; font-size: 14px;"><strong>Browser:</strong> ${deviceInfo.browser}</p>` : ''}
          </div>

          <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4 style="margin: 0 0 10px 0; color: #0369a1;">Is this you?</h4>
            <p style="margin: 0; font-size: 14px;">
              If you recognize this activity, no action is needed. If this wasn't you, please secure your account immediately.
            </p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/security" style="background-color: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Review Account Security
            </a>
          </div>
          
          <p>Stay safe,<br>The TrackRuit Security Team</p>
        </div>
      `;

      await sendEmail({
        to: user.email,
        subject,
        html
      });

      logger.info(`Security alert email sent to ${user.email}`);
      return true;
    } catch (error) {
      logger.error('Security alert email error:', error);
      return false;
    }
  }

  // Helper methods
  getStatusSpecificContent(status) {
    const content = {
      'interview': `
        <div style="background-color: #f0f9ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #0369a1;">🎯 Interview Preparation Tips</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
            <li>Research the company and role thoroughly</li>
            <li>Prepare questions to ask the interviewer</li>
            <li>Review common interview questions for your role</li>
            <li>Practice with mock interviews</li>
          </ul>
        </div>
      `,
      'offered': `
        <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #16a34a;">💰 Offer Received - Next Steps</h4>
          <ul style="margin: 0; padding-left: 20px; font-size: 14px;">
            <li>Review the offer details carefully</li>
            <li>Consider negotiation if appropriate</li>
            <li>Evaluate the total compensation package</li>
            <li>Respond within the given timeframe</li>
          </ul>
        </div>
      `,
      'rejected': `
        <div style="background-color: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <h4 style="margin: 0 0 10px 0; color: #dc2626;">💪 Keep Going!</h4>
          <p style="margin: 0; font-size: 14px;">
            Rejections are part of the process. Every "no" brings you closer to your "yes". 
            Use this as an opportunity to learn and improve for next time.
          </p>
        </div>
      `
    };

    return content[status] || '';
  }

  getWeeklyTip(applicationsCount) {
    const tips = [
      "Customize your resume for each application to highlight relevant skills and experiences.",
      "Follow up with recruiters 5-7 days after applying to show continued interest.",
      "Use the STAR method (Situation, Task, Action, Result) to structure your interview answers.",
      "Network with professionals in your target companies through LinkedIn and industry events.",
      "Practice your elevator pitch to confidently introduce yourself in interviews.",
      "Keep a job search journal to track what works and refine your strategy.",
      "Set up informational interviews to learn more about companies and roles.",
      "Use keywords from job descriptions in your resume to pass ATS systems.",
      "Prepare 3-5 thoughtful questions to ask at the end of every interview.",
      "Take breaks and practice self-care to avoid burnout during your job search."
    ];

    if (applicationsCount === 0) {
      return "Start applying to at least 2-3 jobs per week to build momentum in your search.";
    } else if (applicationsCount < 5) {
      return "Great start! Try increasing your application rate to 5-10 per week for better results.";
    } else if (applicationsCount < 10) {
      return "Excellent pace! Make sure you're also networking and following up on applications.";
    } else {
      return "You're applying consistently! Now focus on quality over quantity and tailor each application.";
    }
  }
}

export const emailService = new EmailService();
export default emailService;