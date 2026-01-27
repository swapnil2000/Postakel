import { PrismaClient } from '@prisma/client';

export class PerformanceService {
  static async createReview(prisma: PrismaClient, userId: string, tenantId: string, data: {
    type: string;
    reviewerId: string;
    title: string;
    content: string;
    strengths?: string[];
    improvements?: string[];
    overallRating?: number;
  }) {
    try {
      const review = await prisma.review.create({
        data: {
          tenantId,
          userId,
          type: data.type,
          reviewerId: data.reviewerId,
          title: data.title,
          content: data.content,
          strengths: data.strengths || [],
          improvements: data.improvements || [],
          overallRating: data.overallRating,
          reviewDate: new Date(),
        },
      });

      return review;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  static async getReviews(prisma: PrismaClient, userId: string, tenantId: string) {
    try {
      const reviews = await prisma.review.findMany({
        where: { userId, tenantId },
        orderBy: { reviewDate: 'desc' },
      });

      return reviews;
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  }

  static async createGoal(prisma: PrismaClient, userId: string, tenantId: string, data: {
    title: string;
    description?: string;
    target: string;
    startDate: Date;
    endDate: Date;
    quarter?: string;
    year: number;
  }) {
    try {
      const goal = await prisma.goal.create({
        data: {
          tenantId,
          userId,
          title: data.title,
          description: data.description,
          target: data.target,
          startDate: data.startDate,
          endDate: data.endDate,
          quarter: data.quarter,
          year: data.year,
        },
      });

      return goal;
    } catch (error) {
      console.error('Error creating goal:', error);
      throw error;
    }
  }

  static async updateGoalProgress(prisma: PrismaClient, goalId: string, progress: number) {
    try {
      const goal = await prisma.goal.update({
        where: { id: goalId },
        data: { progress },
      });

      return goal;
    } catch (error) {
      console.error('Error updating goal progress:', error);
      throw error;
    }
  }

  static async getGoals(prisma: PrismaClient, userId: string, tenantId: string, status?: string) {
    try {
      const where: any = { userId, tenantId };
      if (status) where.status = status;

      const goals = await prisma.goal.findMany({
        where,
        orderBy: { endDate: 'asc' },
      });

      return goals;
    } catch (error) {
      console.error('Error fetching goals:', error);
      throw error;
    }
  }

  static async createPerformanceRating(prisma: PrismaClient, userId: string, tenantId: string, data: {
    ratedBy: string;
    rating: number;
    comment?: string;
    communicationScore?: number;
    teamworkScore?: number;
    productivityScore?: number;
    leadershipScore?: number;
    reviewPeriod?: string;
  }) {
    try {
      const performance = await prisma.performance.create({
        data: {
          tenantId,
          userId,
          ratedBy: data.ratedBy,
          rating: data.rating,
          comment: data.comment,
          communicationScore: data.communicationScore,
          teamworkScore: data.teamworkScore,
          productivityScore: data.productivityScore,
          leadershipScore: data.leadershipScore,
          reviewPeriod: data.reviewPeriod,
          reviewDate: new Date(),
        },
      });

      return performance;
    } catch (error) {
      console.error('Error creating performance rating:', error);
      throw error;
    }
  }
}
