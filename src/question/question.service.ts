import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from 'src/entity/question.entity';
import { CreateQuestionDto, UpdateQuestionDto } from './dto/question.dto';
import { User } from 'src/entity/user.entity';

@Injectable()
export class QuestionService {
  constructor(
    @InjectRepository(Question)
    private readonly questionRepo: Repository<Question>,
  ) {}

  async getUpvoteCount(questionId: number) {
    try {
      const answer = await this.questionRepo.findOne({
        where: {
          id: questionId,
        },
        relations: {
          upvotedBy: true,
        },
      });
      if (!answer) {
        throw new Error('Answer not found');
      }
      const totalUpvotes = answer.upvotedBy.length;

      return totalUpvotes;
    } catch (error) {
      return error;
    }
  }

  async findOne(id: number) {
    try {
      return await this.questionRepo.findOne({
        where: {
          id: id,
        },
        relations: ['upvotedBy', 'assignedTopics', 'answers', 'belongsTo'],
      });
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.questionRepo.find({
        relations: [
          'upvotedBy',
          'belongsTo',
          'assignedTopics',
          'answers',
          'answers.belongsTo',
        ],
        // select:
        //     ['id'],
      });
    } catch (error) {
      throw error;
    }
  }

  async findAllFromUser(user: User) {
    try {
      const questionsList = await this.questionRepo.find({
        where: {
          belongsTo: user,
        },
        relations: ['upvotedBy', 'answers', 'belongsTo', 'answers.belongsTo'],
      });
      const filteredQuestions = questionsList.filter((question) => {
        if (question.answers.length === 0) {
          return false;
        }
        const userAnswer = question.answers.find(
          (answer) => answer.belongsTo.id === user.id,
        );
        if (userAnswer) {
          return {
            ...question,
            answers: [userAnswer],
          };
        } else {
          return false;
        }
      });
      return filteredQuestions;
    } catch (error) {
      throw error;
    }
  }

  async addUpvote(questionId: number, userId: number) {
    try {
      await this.questionRepo
        .createQueryBuilder()
        .relation(Question, 'upvotedBy')
        .of(questionId)
        .add(userId);
      return 'Upvoted successfully';
    } catch (error) {
      throw error;
    }
  }

  async removeUpvote(questionId: number, userId: number) {
    try {
      await this.questionRepo
        .createQueryBuilder()
        .relation(Question, 'upvotedBy')
        .of(questionId)
        .remove(userId);
      return 'Upvote removed successfully';
    } catch (error) {
      throw error;
    }
  }

  async createQuestion(newQuestion: CreateQuestionDto) {
    try {
      const question = await this.questionRepo
        .createQueryBuilder()
        .insert()
        .into(Question)
        .values(newQuestion)
        .execute();
      await this.questionRepo
        .createQueryBuilder()
        .relation(Question, 'assignedTopics')
        .of(question.identifiers[0].id)
        .add(newQuestion.assignedTopics);
      return 'Succesful';
    } catch (error) {
      throw error;
    }
  }

  async updateQuestion(id: number, updatedQuestion: UpdateQuestionDto) {
    try {
      await this.questionRepo
        .createQueryBuilder()
        .update()
        .set(updatedQuestion)
        .where({ id: id })
        .execute();
      return 'Question updated successfully';
    } catch (error) {
      throw error;
    }
  }

  async deleteQuestion(id: number) {
    try {
      await this.questionRepo
        .createQueryBuilder()
        .delete()
        .where({ id: id })
        .execute();
      return 'Question deleted successfully';
    } catch (error) {
      throw error;
    }
  }
}
